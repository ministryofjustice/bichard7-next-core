import type { ConductorWorker } from "@io-orkes/conductor-typescript"
import { dateReviver } from "@moj-bichard7/common/axiosDateTransformer"
import getTaskConcurrency from "@moj-bichard7/common/conductor/getTaskConcurrency"
import type Task from "@moj-bichard7/common/conductor/types/Task"
import { conductorLog } from "@moj-bichard7/common/conductor/utils"
import MqGateway from "@moj-bichard7/common/mq/MqGateway"
import createMqConfig from "@moj-bichard7/common/mq/createMqConfig"
import { AuditLogEventOptions, AuditLogEventSource } from "@moj-bichard7/common/types/AuditLogEvent"
import EventCategory from "@moj-bichard7/common/types/EventCategory"
import { isError } from "@moj-bichard7/common/types/Result"
import logger from "@moj-bichard7/common/utils/logger"
import convertAhoToXml from "phase1/serialise/ahoXml/generate"
import type { Phase1SuccessResult } from "phase1/types/Phase1Result"

const mqConfig = createMqConfig()
const mqGateway = new MqGateway(mqConfig)
const mqQueue = process.env.PHASE_2_QUEUE_NAME ?? "HEARING_OUTCOME_PNC_UPDATE_QUEUE"

const taskDefName = "send_to_phase2"

const sendToPhase2: ConductorWorker = {
  taskDefName,
  concurrency: getTaskConcurrency(taskDefName),
  execute: async (task: Task) => {
    try {
      const phase1Result: Phase1SuccessResult = task.inputData?.phase1Result

      if (!phase1Result) {
        return {
          logs: [conductorLog("s3Path must be specified")],
          status: "FAILED_WITH_TERMINAL_ERROR"
        }
      }

      const aho = JSON.parse(JSON.stringify(phase1Result.hearingOutcome), dateReviver)

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
