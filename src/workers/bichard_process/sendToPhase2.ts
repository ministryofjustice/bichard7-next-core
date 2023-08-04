import type { ConductorWorker } from "@io-orkes/conductor-typescript"
import getTaskConcurrency from "conductor/src/getTaskConcurrency"
import type { Task } from "conductor/src/types/Task"
import { conductorLog } from "conductor/src/utils"
import { isError } from "src/comparison/types"
import { MqGateway } from "src/lib/MqGateway"
import createMqConfig from "src/lib/createMqConfig"
import logger from "src/lib/logging"
import parseAhoJson from "src/parse/parseAhoJson"
import convertAhoToXml from "src/serialise/ahoXml/generate"
import { AuditLogEventOptions, AuditLogEventSource } from "../../types/AuditLogEvent"
import EventCategory from "../../types/EventCategory"

const mqConfig = createMqConfig()
const mqGateway = new MqGateway(mqConfig)
const mqQueue = process.env.PHASE_2_QUEUE_NAME ?? "HEARING_OUTCOME_PNC_UPDATE_QUEUE"

const taskDefName = "send_to_phase2"

const sendToPhase2: ConductorWorker = {
  taskDefName,
  concurrency: getTaskConcurrency(taskDefName),
  execute: async (task: Task) => {
    try {
      if (!task.inputData?.aho) {
        return {
          logs: [conductorLog("aho must be provided")],
          status: "FAILED_WITH_TERMINAL_ERROR"
        }
      }

      const aho = parseAhoJson(task.inputData.aho)

      const result = await mqGateway.sendMessage(convertAhoToXml(aho), mqQueue)
      if (isError(result)) {
        return {
          logs: [conductorLog("Failed to write to MQ")],
          status: "FAILED"
        }
      }

      const auditLog = {
        eventCode: AuditLogEventOptions.submittedToPhase2.code,
        eventType: AuditLogEventOptions.submittedToPhase2.type,
        category: EventCategory.debug,
        eventSource: AuditLogEventSource.CoreHandler,
        timestamp: new Date().toISOString(),
        attributes: {}
      }

      return {
        logs: [conductorLog("Sent to Phase 2 via MQ")],
        outputData: { auditLogEvents: [auditLog] },
        status: "COMPLETED"
      }
    } catch (e) {
      logger.error(e)
      return {
        logs: [conductorLog(`Send to phase 2 failed: ${(e as Error).message}`)],
        status: "FAILED"
      }
    }
  }
}

export default sendToPhase2
