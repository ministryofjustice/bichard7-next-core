import type { ConductorWorker } from "@io-orkes/conductor-typescript"
import AuditLogApiClient from "@moj-bichard7/common/AuditLogApiClient/AuditLogApiClient"
import createApiConfig from "@moj-bichard7/common/AuditLogApiClient/createApiConfig"
import getTaskConcurrency from "@moj-bichard7/common/conductor/getTaskConcurrency"
import { conductorLog } from "@moj-bichard7/common/conductor/logging"
import type Task from "@moj-bichard7/common/conductor/types/Task"
import { isError } from "@moj-bichard7/common/types/Result"

const taskDefName = "create_audit_log_record"

const { apiKey, apiUrl } = createApiConfig()
const apiClient = new AuditLogApiClient(apiUrl, apiKey, 30_000)

const createAuditLogRecord: ConductorWorker = {
  taskDefName,
  concurrency: getTaskConcurrency(taskDefName),
  execute: async (task: Task) => {
    const auditLogRecord = task.inputData?.auditLogRecord
    if (!auditLogRecord) {
      return Promise.resolve({
        logs: [conductorLog("auditLogRecord must be specified")],
        status: "FAILED_WITH_TERMINAL_ERROR"
      })
    }

    const apiResult = await apiClient.createAuditLog(auditLogRecord)

    if (isError(apiResult)) {
      // TODO: Check if the message has already been received by looking up the hash
      return Promise.resolve({
        logs: [conductorLog("Could not create audit log")],
        status: "FAILED"
      })
    }

    return Promise.resolve({
      status: "COMPLETED"
    })
  }
}

export default createAuditLogRecord
