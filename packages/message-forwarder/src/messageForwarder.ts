import logger from "@moj-bichard7/common/utils/logger"
import type { Client, Message } from "@stomp/stompjs"
import { WebSocket } from "ws"
import forwardMessage from "./forwardMessage/forwardMessage"
import { isError } from "@moj-bichard7/common/types/Result"
import type { ConductorClient } from "@io-orkes/conductor-javascript"
Object.assign(global, { WebSocket })

const sourceQueue = process.env.SOURCE_QUEUE ?? "PHASE_1_RESUBMIT_QUEUE"

export function messageForwarder(stompClient: Client, conductorClient: ConductorClient): Promise<void> {
  return new Promise((resolve) => {
    stompClient.onConnect = () => {
      logger.info("Connected to MQ")
      stompClient.subscribe(
        sourceQueue,
        async (message: Message) => {
          const tx = stompClient.begin()
          try {
            const forwardMessageResult = await forwardMessage(message.body, stompClient, conductorClient)
            if (isError(forwardMessageResult)) {
              throw forwardMessageResult
            }

            message.ack()
          } catch (e) {
            logger.error(e)
            logger.info({ event: "message-forwarder:error-forwarding-message" })
            message.nack()
          }
          tx.commit()
        },
        { ack: "client" }
      )
      resolve()
    }

    stompClient.activate()
  })
}
