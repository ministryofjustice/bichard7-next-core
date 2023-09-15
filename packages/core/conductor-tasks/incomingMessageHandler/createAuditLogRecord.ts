import type { ConductorWorker } from "@io-orkes/conductor-javascript"
import AuditLogApiClient from "@moj-bichard7/common/AuditLogApiClient/AuditLogApiClient"
import createApiConfig from "@moj-bichard7/common/AuditLogApiClient/createApiConfig"
import getTaskConcurrency from "@moj-bichard7/common/conductor/getTaskConcurrency"
import { conductorLog } from "@moj-bichard7/common/conductor/logging"
import { auditLogApiRecordInputSchema } from "@moj-bichard7/common/schemas/auditLogRecord"
import EventCode from "@moj-bichard7/common/types/EventCode"
import { isError } from "@moj-bichard7/common/types/Result"
import type Task from "@moj-bichard7/conductor/src/Task"
import inputDataValidator from "@moj-bichard7/conductor/src/middleware/inputDataValidator"
import { z } from "zod"

const taskDefName = "create_audit_log_record"

const { apiKey, apiUrl } = createApiConfig()
const apiClient = new AuditLogApiClient(apiUrl, apiKey, 30_000)

const inputDataSchema = z.object({
  auditLogRecord: auditLogApiRecordInputSchema
})
type InputData = z.infer<typeof inputDataSchema>

const createAuditLogRecord: ConductorWorker = {
  taskDefName,
  concurrency: getTaskConcurrency(taskDefName),
  execute: inputDataValidator(inputDataSchema, async (task: Task<InputData>) => {
    const { auditLogRecord } = task.inputData

    const apiResult = await apiClient.createAuditLog(auditLogRecord)
    if (isError(apiResult)) {
      if (/Message hash already exists/i.test(apiResult.message)) {
        const existingAuditLog = await apiClient.getMessageByHash(auditLogRecord.messageHash)
        if (isError(existingAuditLog)) {
          return Promise.resolve({
            status: "FAILED",
            logs: [conductorLog("Could not fetch audit log with same message hash")]
          })
        }

        return Promise.resolve({
          status: "COMPLETED",
          logs: [conductorLog(`Duplicate message hash identified: ${auditLogRecord.messageHash}`)],
          outputData: {
            duplicateMessage: "isDuplicate",
            duplicateCorrelationId: existingAuditLog.messageId,
            auditLogEvents: [
              {
                attributes: {
                  s3Path: auditLogRecord.s3Path ?? "unknown",
                  receivedDate: auditLogRecord.receivedDate,
                  externalId: auditLogRecord.externalId ?? "unknown",
                  externalCorrelationId: auditLogRecord.externalCorrelationId
                },
                category: "information",
                eventCode: EventCode.DuplicateMessage,
                eventSource: "Incoming Message Handler",
                eventType: "Duplicate message",
                timestamp: new Date()
              }
            ]
          }
        })
      }

      return Promise.resolve({
        status: "FAILED",
        logs: [conductorLog("Could not create audit log"), conductorLog(apiResult.message)]
      })
    }

    return Promise.resolve({
      status: "COMPLETED",
      logs: [conductorLog(`Created audit log for message: ${auditLogRecord.messageId}`)]
    })
  })
}

export default createAuditLogRecord
