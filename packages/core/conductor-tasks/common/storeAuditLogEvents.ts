import type { ConductorWorker } from "@io-orkes/conductor-javascript"
import getTaskConcurrency from "@moj-bichard7/common/conductor/getTaskConcurrency"
import { conductorLog } from "@moj-bichard7/common/conductor/logging"
import type Task from "@moj-bichard7/common/conductor/types/Task"
import axios from "axios"

const taskDefName = "store_audit_log_events"

const auditLogApiUrl = process.env.AUDIT_LOG_API_URL
const auditLogApiKey = process.env.AUDIT_LOG_API_KEY

if (!auditLogApiUrl || !auditLogApiKey) {
  throw new Error("AUDIT_LOG_API_URL and AUDIT_LOG_API_KEY environment variables must be set")
}

const storeAuditLogEvents: ConductorWorker = {
  taskDefName,
  concurrency: getTaskConcurrency(taskDefName),
  execute: async (task: Task) => {
    const correlationId = task.inputData?.correlationId
    const auditLogEvents = task.inputData?.auditLogEvents

    if (correlationId && auditLogEvents.length > 0) {
      await axios.post(`${auditLogApiUrl}/messages/${correlationId}/events`, auditLogEvents, {
        headers: { "X-Api-Key": auditLogApiKey },
        transformResponse: (x) => x
      })
    }

    return {
      status: "COMPLETED",
      logs: [conductorLog(`${auditLogEvents.length} audit log events written to API`)]
    }
  }
}

export default storeAuditLogEvents
