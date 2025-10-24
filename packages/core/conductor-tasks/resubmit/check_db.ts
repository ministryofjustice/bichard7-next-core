import type { ConductorWorker } from "@io-orkes/conductor-javascript"
import type Task from "@moj-bichard7/common/conductor/types/Task"
import type { CaseRow } from "@moj-bichard7/common/types/Case"
import type { PromiseResult } from "@moj-bichard7/common/types/Result"
import type { TransactionSql } from "postgres"

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
import ResolutionStatus from "../../types/ResolutionStatus"

const taskDataBucket = process.env.TASK_DATA_BUCKET_NAME || "conductor-task-data"

const s3Config = createS3Config()
const dbConfig = createDbConfig()

const inputDataSchema = z.object({
  messageId: z.string().or(z.uuid()),
  autoResubmit: z.boolean()
})
type InputData = z.infer<typeof inputDataSchema>

const autoResubmitHandler = async (
  dbTransaction: TransactionSql,
  messageId: string,
  auditLogger: CoreAuditLogger
): Promise<void> => {
  const user = "service.user"

  const caseRows = await dbTransaction<
    CaseRow[]
  >`SELECT el.error_locked_by_id, el.error_status FROM br7own.error_list el WHERE message_id = ${messageId}`

  if (caseRows.length === 0) {
    throw new Error(`Case not found: ${messageId}`)
  }

  const caseRow = caseRows[0]

  if (caseRow.error_locked_by_id) {
    throw new Error(`Case is locked: ${messageId}`)
  }

  if (caseRow.error_status !== ResolutionStatus.UNRESOLVED) {
    throw new Error(`Case is not Unresolved: ${messageId}`)
  }

  const updateRow = await dbTransaction`
    UPDATE br7own.error_list
    SET
      error_locked_by_id = ${user},
      error_status = ${ResolutionStatus.SUBMITTED}
    WHERE message_id = ${messageId}
  `.catch((error: Error) => error)

  if (isError(updateRow)) {
    throw new Error(`Failed to lock DB record for ${messageId}`)
  }

  auditLogger.info(EventCode.ExceptionsLocked, { user })
}

const checkDb: ConductorWorker = {
  taskDefName: "check_db",
  execute: inputDataValidator(inputDataSchema, async (task: Task<InputData>) => {
    const { messageId, autoResubmit } = task.inputData
    const db = postgres(dbConfig)
    const auditLogger = new CoreAuditLogger(AuditLogEventSource.CoreResubmit)

    const result = await db
      .begin("read write", async (dbTransaction): PromiseResult<string> => {
        if (autoResubmit) {
          await autoResubmitHandler(dbTransaction, messageId, auditLogger)
        }

        const [caseRow] =
          (await dbTransaction`SELECT * FROM br7own.error_list el WHERE el.message_id = ${messageId}`) as CaseRow[]

        if (!caseRow) {
          throw new Error(`Case not found: ${messageId}`)
        }

        if (caseRow.error_status !== ResolutionStatus.SUBMITTED || !caseRow.error_locked_by_id) {
          throw new Error("Case has wrong Error Status or has no lock")
        }

        const s3Data = JSON.stringify({
          messageId,
          errorLockedByUsername: caseRow.error_locked_by_id,
          events: auditLogger.getEvents(),
          autoResubmit
        })

        const s3TaskDataPath = `${messageId}.json`
        const s3Result = await putFileToS3(s3Data, s3TaskDataPath, taskDataBucket, s3Config)

        if (isError(s3Result)) {
          throw s3Result
        }

        return s3TaskDataPath
      })
      .catch((error: Error) => error)

    if (isError(result)) {
      return failed(`${result.name}: ${result.message}`)
    }

    return completed({ s3TaskDataPath: result }, `Can be resubmitted ${messageId}`)
  })
}

export default checkDb
