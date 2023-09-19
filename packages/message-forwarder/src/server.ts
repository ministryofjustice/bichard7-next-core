import type { Message } from "@stomp/stompjs"
import { WebSocket } from "ws"
import createStompClient from "./createStompClient"
import forwardMessage from "./forward-message"
Object.assign(global, { WebSocket })

const sourceQueue = process.env.SOURCE_QUEUE ?? "PHASE_1_RESUBMIT_QUEUE"

const client = createStompClient()

client.onConnect = () => {
  console.log("Connected")
  client.subscribe(sourceQueue, async (message: Message) => {
    console.log("Received message")

    try {
      await forwardMessage(message.body, client)
    } catch (e) {
      console.error(e)
    }
  })
}

client.activate()
