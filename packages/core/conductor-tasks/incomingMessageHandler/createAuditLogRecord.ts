import type { ConductorWorker } from "@io-orkes/conductor-typescript"
import AuditLogApiClient from "@moj-bichard7/common/AuditLogApiClient/AuditLogApiClient"
import createApiConfig from "@moj-bichard7/common/AuditLogApiClient/createApiConfig"
import getTaskConcurrency from "@moj-bichard7/common/conductor/getTaskConcurrency"
import { conductorLog } from "@moj-bichard7/common/conductor/logging"
import type Task from "@moj-bichard7/common/conductor/types/Task"
import { type InputApiAuditLog } from "@moj-bichard7/common/types/AuditLogRecord"
import EventCode from "@moj-bichard7/common/types/EventCode"
import { isError } from "@moj-bichard7/common/types/Result"

const taskDefName = "create_audit_log_record"

const { apiKey, apiUrl } = createApiConfig()
const apiClient = new AuditLogApiClient(apiUrl, apiKey, 30_000)

const createAuditLogRecord: ConductorWorker = {
  taskDefName,
  concurrency: getTaskConcurrency(taskDefName),
  execute: async (task: Task) => {
    const auditLogRecord = task.inputData?.auditLogRecord as InputApiAuditLog
    if (!auditLogRecord) {
      return Promise.resolve({
        status: "FAILED_WITH_TERMINAL_ERROR",
        logs: [conductorLog("auditLogRecord must be specified")]
      })
    }

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
  }
}

export default createAuditLogRecord
