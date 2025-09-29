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
import { AuditLogEventSource } from "@moj-bichard7/common/types/AuditLogEvent"
import EventCode from "@moj-bichard7/common/types/EventCode"
import { isError } from "@moj-bichard7/common/types/Result"
import postgres from "postgres"
import { z } from "zod"

import CoreAuditLogger from "../../lib/auditLog/CoreAuditLogger"
import insertErrorListNotes from "../../lib/database/insertErrorListNotes"
import Phase from "../../types/Phase"

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

const handleCaseResubmission = async (
  sql: Sql,
  messageId: string,
  auditLogger: CoreAuditLogger
): PromiseResult<ResubmitResult> => {
  const caseRowResult = await sql`SELECT * FROM br7own.error_list el WHERE el.message_id = ${messageId}`

  if (!caseRowResult[0]) {
    throw new Error(`Couldn't find Case with messageId: ${messageId}`)
  }

  const caseRow = caseRowResult[0]

  if (caseRow.updated_msg === null) {
    throw new Error("Missing updated_msg")
  }

  await insertErrorListNotes(sql, caseRow.error_id, [
    `${caseRow.error_locked_by_id}: Portal Action: Resubmitted Message.`
  ])

  await sql`
    UPDATE br7own.error_list
    SET error_locked_by_id = null
    WHERE error_id = ${caseRow.error_id}
  `

  auditLogger.info(EventCode.ExceptionsUnlocked, { user: caseRow.error_locked_by_id })

  const message = parseHearingOutcome(caseRow.updated_msg)

  if (isError(message)) {
    throw message
  }

  const s3TaskDataPath = `${messageId}.json`
  const s3Result = await putFileToS3(JSON.stringify(message), s3TaskDataPath, taskDataBucket, s3Config)

  if (isError(s3Result)) {
    throw s3Result
  }

  auditLogger.info(
    caseRow.phase === Phase.HEARING_OUTCOME
      ? EventCode.HearingOutcomeResubmittedPhase1
      : EventCode.HearingOutcomeResubmittedPhase2,
    { user: caseRow.error_locked_by_id }
  )

  return { phase: caseRow.phase, s3TaskDataPath }
}

const processResubmit: ConductorWorker = {
  taskDefName: "process_resubmit",
  execute: inputDataValidator(inputDataSchema, async (task: Task<InputData>) => {
    const { messageId } = task.inputData
    const db = postgres(dbConfig)
    const auditLogger = new CoreAuditLogger(AuditLogEventSource.CoreResubmit)

    const result = await db
      .begin("read write", async (sql): PromiseResult<ResubmitResult> => {
        return await handleCaseResubmission(sql, messageId, auditLogger)
      })
      .catch((error: Error) => error)

    if (isError(result)) {
      return failed(`${result.name}: ${result.message}`)
    }

    return completed({
      currentPhase: result.phase,
      s3TaskDataPath: result.s3TaskDataPath,
      auditLogEvents: auditLogger.getEvents()
    })
  })
}

export default processResubmit
