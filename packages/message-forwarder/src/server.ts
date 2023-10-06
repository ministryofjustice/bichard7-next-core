import logger from "@moj-bichard7/common/utils/logger"
import type { Message } from "@stomp/stompjs"
import { WebSocket } from "ws"
import createStompClient from "./createStompClient"
import forwardMessage from "./forward-message"
Object.assign(global, { WebSocket })

const sourceQueue = process.env.SOURCE_QUEUE ?? "PHASE_1_RESUBMIT_QUEUE"

const client = createStompClient()

client.onConnect = () => {
  logger.info("Connected to MQ")
  client.subscribe(sourceQueue, async (message: Message) => {
    try {
      await forwardMessage(message.body, client)
    } catch (e) {
      logger.error(e)
    }
  })
}

client.activate()
