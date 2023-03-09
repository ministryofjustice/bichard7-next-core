import { isError } from "src/comparison/types"
import createMqConfig from "src/lib/createMqConfig"
import { MqGateway } from "src/lib/MqGateway"
import convertAhoToXml from "src/serialise/ahoXml/generate"
import type { Phase1SuccessResult } from "src/types/Phase1Result"

const mqConfig = createMqConfig()
const mqGateway = new MqGateway(mqConfig)
const mqQueue = process.env.PHASE_2_QUEUE_NAME ?? "PNC_UPDATE_REQUEST_QUEUE"

const sendToPhase2 = async (phase1Result: Phase1SuccessResult): Promise<Phase1SuccessResult> => {
  const result = await mqGateway.sendMessage(convertAhoToXml(phase1Result.hearingOutcome), mqQueue)
  if (isError(result)) {
    throw result
  }
  phase1Result.auditLogEvents.push({
    eventCode: "hearing-outcome.submitted-phase-2",
    eventType: "Hearing outcome submitted to phase 2",
    category: "debug",
    eventSource: "CoreHandler",
    timestamp: new Date().toISOString(),
    attributes: {}
  })
  return phase1Result
}

export default sendToPhase2
