import MqGateway from "./MqGateway/MqGateway"
import createMqConfig from "./MqGateway/createMqConfig"
import forwardMessage from "./forward-message"

const mqConfig = createMqConfig()
const mqGateway = new MqGateway(mqConfig)
const sourceQueue = process.env.SOURCE_QUEUE ?? "PHASE_1_RESUBMIT_QUEUE"

const main = async () => {
  try {
    await mqGateway.subscribe(sourceQueue, async (message) => {
      console.log("Received message")
      await forwardMessage(message, mqGateway)
    })
    console.log(`Subscribed to ${sourceQueue}`)
  } catch (e) {
    console.error(e)
  }
}

main()
