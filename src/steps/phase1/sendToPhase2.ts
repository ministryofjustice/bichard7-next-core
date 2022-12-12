import { isError } from "src/comparison/types"
import createMqConfig from "src/lib/createMqConfig"
import { MqGateway } from "src/lib/MqGateway"
import convertAhoToXml from "src/serialise/ahoXml/generate"
import type { Phase1SuccessResult } from "src/types/Phase1Result"

const mqConfig = createMqConfig()
const mqGateway = new MqGateway(mqConfig)
const mqQueue = process.env.MQ_QUEUE_NAME ?? "PNC_UPDATE_REQUEST_QUEUE"

const sendToPhase2 = async (phase1Result: Phase1SuccessResult): Promise<void> => {
  const result = await mqGateway.sendMessage(convertAhoToXml(phase1Result.hearingOutcome), mqQueue)
  if (isError(result)) {
    throw result
  }
}

export default sendToPhase2
