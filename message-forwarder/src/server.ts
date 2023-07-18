import MqGateway from "./MqGateway/MqGateway"
import createMqConfig from "./MqGateway/createMqConfig"
import { isError } from "./Result"
import forwardMessage from "./forward-message"

const mqConfig = createMqConfig()
const mqGateway = new MqGateway(mqConfig)
const sourceQueue = process.env.SOURCE_QUEUE ?? "PHASE_1_RESUBMIT_QUEUE"

const main = async () => {
  while (true) {
    const message = await mqGateway.getMessage(sourceQueue)
    if (isError(message)) {
      continue
    }
    await forwardMessage(message, mqGateway)
  }
}

main()
