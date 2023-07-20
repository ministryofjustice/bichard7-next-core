import type { Message } from "@stomp/stompjs"
import { Client } from "@stomp/stompjs"
import { WebSocket } from "ws"
import createMqConfig from "./MqGateway/createMqConfig"
import forwardMessage from "./forward-message"
Object.assign(global, { WebSocket })

const mqConfig = createMqConfig()
const sourceQueue = process.env.SOURCE_QUEUE ?? "PHASE_1_RESUBMIT_QUEUE"

const client = new Client({
  brokerURL: mqConfig.url,
  connectHeaders: {
    login: mqConfig.username,
    passcode: mqConfig.password
  }
})

console.log(`Connecting to ${mqConfig.url}`)
client.onConnect = () => {
  console.log("Connected")
  client.subscribe(sourceQueue, async (message: Message) => {
    console.log("Received message")
    await forwardMessage(message.body, client)
  })
}

client.activate()
