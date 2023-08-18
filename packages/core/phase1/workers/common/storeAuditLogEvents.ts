import type { ConductorWorker } from "@io-orkes/conductor-typescript"
import axios from "axios"
import getTaskConcurrency from "packages/conductor/src/getTaskConcurrency"
import type { Task } from "packages/conductor/src/types/Task"
import { conductorLog } from "packages/conductor/src/utils"

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
      logs: [conductorLog("Audit logs written to API")],
      status: "COMPLETED"
    }
  }
}

export default storeAuditLogEvents
