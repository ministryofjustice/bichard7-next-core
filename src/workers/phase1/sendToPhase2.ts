import type { ConductorWorker } from "@io-orkes/conductor-typescript"
import getTaskConcurrency from "conductor/src/getTaskConcurrency"
import type { Task } from "conductor/src/types/Task"
import { conductorLog } from "conductor/src/utils"
import { isError } from "src/comparison/types"
import { dateReviver } from "src/lib/axiosDateTransformer"
import createMqConfig from "src/lib/createMqConfig"
import { MqGateway } from "src/lib/MqGateway"
import convertAhoToXml from "src/serialise/ahoXml/generate"
import type { Phase1SuccessResult } from "src/types/Phase1Result"

const mqConfig = createMqConfig()
const mqGateway = new MqGateway(mqConfig)
const mqQueue = process.env.PHASE_2_QUEUE_NAME ?? "PNC_UPDATE_REQUEST_QUEUE"

const taskDefName = "send_to_phase2"

const sendToPhase2: ConductorWorker = {
  taskDefName,
  concurrency: getTaskConcurrency(taskDefName),
  execute: async (task: Task) => {
    const phase1Result: Phase1SuccessResult = task.inputData?.phase1Result

    if (!phase1Result) {
      return Promise.resolve({
        logs: [conductorLog("s3Path must be specified")],
        status: "FAILED_WITH_TERMINAL_ERROR"
      })
    }

    const aho = JSON.parse(JSON.stringify(phase1Result.hearingOutcome), dateReviver)

    const result = await mqGateway.sendMessage(convertAhoToXml(aho), mqQueue)
    if (isError(result)) {
      return {
        logs: [conductorLog("Failed to write to MQ")],
        status: "FAILED"
      }
    }

    phase1Result.auditLogEvents.push({
      eventCode: "hearing-outcome.submitted-phase-2",
      eventType: "Hearing outcome submitted to phase 2",
      category: "debug",
      eventSource: "CoreHandler",
      timestamp: new Date().toISOString(),
      attributes: {}
    })

    return {
      logs: [conductorLog("Sent to Phase 2 via MQ")],
      outputData: { result: phase1Result },
      status: "COMPLETED"
    }
  }
}

export default sendToPhase2
