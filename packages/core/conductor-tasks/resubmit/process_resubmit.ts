import type { ConductorWorker } from "@io-orkes/conductor-javascript"
import type Task from "@moj-bichard7/common/conductor/types/Task"
import type { PromiseResult } from "@moj-bichard7/common/types/Result"
import type { Sql } from "postgres"

import { parseHearingOutcome } from "@moj-bichard7/common/aho/parseHearingOutcome"
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

type ResubmitResult = {
  phase: number
  s3TaskDataPath: string
}

const handleCaseResubmission = async (sql: Sql, messageId: string): PromiseResult<ResubmitResult> => {
  const caseRowResult = await sql`SELECT * FROM br7own.error_list el WHERE el.message_id = ${messageId}`.catch(
    (error: Error) => error
  )

  if (isError(caseRowResult)) {
    return caseRowResult
  }

  if (!caseRowResult[0]) {
    return new Error(`Couldn't find Case with messageId: ${messageId}`)
  }

  const caseRow = caseRowResult[0]

  if (caseRow.updated_msg === null) {
    return new Error("Missing updated_msg")
  }

  const note = await insertErrorListNotes(sql, caseRow.error_id, [
    `${caseRow.error_locked_by_id}: Portal Action: Resubmitted Message.`
  ]).catch((error: Error) => error)

  if (isError(note)) {
    return note
  }

  const setErrorUnlocked = await sql`
    UPDATE br7own.error_list
    SET error_locked_by_id = null
    WHERE error_id = ${caseRow.error_id}
  `.catch((error: Error) => error)

  if (isError(setErrorUnlocked)) {
    return setErrorUnlocked
  }

  const message = parseHearingOutcome(caseRow.updated_msg)

  if (isError(message)) {
    return message
  }

  const s3TaskDataPath = `${messageId}.json`
  const s3Result = await putFileToS3(JSON.stringify(message), s3TaskDataPath, taskDataBucket, s3Config)

  if (isError(s3Result)) {
    return new Error(`Could not put file to S3: ${s3TaskDataPath}`)
  }

  return { phase: caseRow.phase, s3TaskDataPath }
}

const processResubmit: ConductorWorker = {
  taskDefName: "process_resubmit",
  execute: inputDataValidator(inputDataSchema, async (task: Task<InputData>) => {
    const { messageId } = task.inputData
    const db = postgres(dbConfig)

    const result = await db.begin("read write", async (sql): PromiseResult<ResubmitResult> => {
      return await handleCaseResubmission(sql, messageId)
    })

    if (isError(result)) {
      return failed(`${result.name}: ${result.message}`)
    }

    return completed({ currentPhase: result.phase, s3TaskDataPath: result.s3TaskDataPath })
  })
}

export default processResubmit
