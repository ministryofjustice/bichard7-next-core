import type { ConductorWorker } from "@io-orkes/conductor-javascript"
import type Task from "@moj-bichard7/common/conductor/types/Task"
import type { AnnotatedHearingOutcome } from "@moj-bichard7/common/types/AnnotatedHearingOutcome"
import type { CaseRow } from "@moj-bichard7/common/types/Case"
import type { PromiseResult } from "@moj-bichard7/common/types/Result"
import type { Sql } from "postgres"

import parseAhoXml from "@moj-bichard7/common/aho/parseAhoXml/parseAhoXml"
import { completed, failed } from "@moj-bichard7/common/conductor/helpers/index"
import inputDataValidator from "@moj-bichard7/common/conductor/middleware/inputDataValidator"
import createDbConfig from "@moj-bichard7/common/db/createDbConfig"
import createS3Config from "@moj-bichard7/common/s3/createS3Config"
import putFileToS3 from "@moj-bichard7/common/s3/putFileToS3"
import { isError } from "@moj-bichard7/common/types/Result"
import postgres from "postgres"
import { z } from "zod"

import insertErrorListNotes from "../../lib/database/insertErrorListNotes"

const taskDataBucket = process.env.TASK_DATA_BUCKET_NAME || "conductor-task-data"

const dbConfig = createDbConfig()
const s3Config = createS3Config()

const inputDataSchema = z.object({
  messageId: z.uuid()
})
type InputData = z.infer<typeof inputDataSchema>

const updatedAho = async (sql: Sql, messageId: string): PromiseResult<AnnotatedHearingOutcome> => {
  const [caseRow] = (await sql`SELECT * FROM br7own.error_list el WHERE el.message_id = ${messageId}`) as CaseRow[]

  await insertErrorListNotes(sql, caseRow.error_id, [
    `${caseRow.error_locked_by_id}: Portal Action: Resubmitted Message.`
  ])

  await sql`
    UPDATE br7own.error_list
    SET error_locked_by_id = null
    WHERE error_id = ${caseRow.error_id}
  `

  const [updatedCaseRow] =
    (await sql`SELECT * FROM br7own.error_list el WHERE el.message_id = ${messageId}`) as CaseRow[]

  if (updatedCaseRow.updated_msg === null) {
    throw new Error("Missing updated_msg")
  }

  const ahoResult = parseAhoXml(updatedCaseRow.updated_msg)

  if (isError(ahoResult)) {
    throw ahoResult
  }

  return ahoResult
}

const processResubmit: ConductorWorker = {
  taskDefName: "process_resubmit",
  execute: inputDataValidator(inputDataSchema, async (task: Task<InputData>) => {
    const { messageId } = task.inputData
    const db = postgres(dbConfig)

    const result = await db
      .begin("read write", async (sql): PromiseResult<AnnotatedHearingOutcome> => {
        return await updatedAho(sql, messageId)
      })
      .catch((error: Error) => error)

    if (isError(result)) {
      return failed(`${result.name}: ${result.message}`)
    }

    const s3TaskDataPath = `${messageId}.json`
    const s3Result = await putFileToS3(JSON.stringify(result), s3TaskDataPath, taskDataBucket, s3Config)

    if (isError(s3Result)) {
      return failed(`Could not put file to S3: ${s3TaskDataPath}`, s3Result.message)
    }

    return completed({ s3TaskDataPath })
  })
}

export default processResubmit
