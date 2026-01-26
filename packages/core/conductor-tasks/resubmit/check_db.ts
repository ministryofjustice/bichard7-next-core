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

const SERVICE_USERNAME = "service.user"
export const AUTO_RESUBMIT_LOG_PREFIX = "[AutoResubmit]"

const caseLocked = (caseRow: CaseRow): boolean => !!caseRow.error_locked_by_id

const autoResubmitHandler = async (
  dbTransaction: TransactionSql,
  caseRow: CaseRow,
  auditLogger: CoreAuditLogger
): Promise<void> => {
  if (caseLocked(caseRow)) {
    throw new Error(`${AUTO_RESUBMIT_LOG_PREFIX} Case is locked: ${caseRow.message_id}`)
  }

  if (caseRow.error_status !== ResolutionStatus.UNRESOLVED) {
    throw new Error(`${AUTO_RESUBMIT_LOG_PREFIX} Case is not unresolved: ${caseRow.message_id}`)
  }

  const updateRow = await dbTransaction`
    UPDATE br7own.error_list
    SET
      error_locked_by_id = ${SERVICE_USERNAME},
      error_status = ${ResolutionStatus.SUBMITTED}
    WHERE message_id = ${caseRow.message_id}
  `.catch((error: Error) => error)

  if (isError(updateRow)) {
    throw new Error(`${AUTO_RESUBMIT_LOG_PREFIX} Failed to lock DB record for ${caseRow.message_id}`)
  }

  auditLogger.info(EventCode.ExceptionsLocked, { user: SERVICE_USERNAME })
}

const checkDb: ConductorWorker = {
  taskDefName: "check_db",
  execute: inputDataValidator(inputDataSchema, async (task: Task<InputData>) => {
    const { messageId, autoResubmit } = task.inputData
    const db = postgres(dbConfig)
    const auditLogger = new CoreAuditLogger(AuditLogEventSource.CoreResubmit)

    const result = await db
      .begin("read write", async (dbTransaction): PromiseResult<string> => {
        const [caseRow] = await dbTransaction<CaseRow[]>`
          SELECT *
          FROM br7own.error_list el
          WHERE el.message_id = ${messageId}
        `

        if (!caseRow) {
          throw new Error(`Case not found message ID: ${messageId}`)
        }

        if (autoResubmit) {
          await autoResubmitHandler(dbTransaction, caseRow, auditLogger)
        } else {
          if (!caseLocked(caseRow)) {
            throw new Error(`Case is not locked: ${caseRow.message_id}`)
          }

          if (caseRow.error_status !== ResolutionStatus.UNRESOLVED) {
            throw new Error(`Case is not Unresolved: ${messageId}`)
          }

          const updatedRow = await dbTransaction`
            UPDATE br7own.error_list
            SET
              error_status = ${ResolutionStatus.SUBMITTED}
            WHERE message_id = ${messageId}
          `.catch((error: Error) => error)

          if (isError(updatedRow)) {
            throw new Error(`Failed to update error status ${messageId}`)
          }
        }

        const s3Data = JSON.stringify({
          messageId,
          errorLockedByUsername: autoResubmit ? SERVICE_USERNAME : caseRow.error_locked_by_id,
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
      if (result.message.startsWith(AUTO_RESUBMIT_LOG_PREFIX)) {
        return completed({ autoFailed: true, errorMessage: result.message }, `${result.message}`)
      }

      return failed(`${result.name}: ${result.message}`)
    }

    return completed({ s3TaskDataPath: result }, `Can be resubmitted ${messageId}`)
  })
}

export default checkDb
