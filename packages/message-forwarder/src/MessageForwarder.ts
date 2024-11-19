import type { ConductorClient } from "@io-orkes/conductor-javascript"
import { isError } from "@moj-bichard7/common/types/Result"
import logger from "@moj-bichard7/common/utils/logger"
import type { Client, Message, StompSubscription } from "@stomp/stompjs"
import { WebSocket } from "ws"
import forwardMessage from "./forwardMessage/forwardMessage"
Object.assign(global, { WebSocket })

const sourceQueue = process.env.SOURCE_QUEUE ?? "PHASE_1_RESUBMIT_QUEUE"

class MessageForwarder {
  private subscription: StompSubscription

  constructor(
    private stompClient: Client,
    private conductorClient: ConductorClient
  ) {}

  start(): Promise<void> {
    return new Promise((resolve) => {
      this.stompClient.onConnect = () => {
        logger.info("Connected to MQ")
        this.subscription = this.stompClient.subscribe(
          sourceQueue,
          async (message: Message) => {
            const tx = this.stompClient.begin()
            try {
              const forwardMessageResult = await forwardMessage(message.body, this.stompClient, this.conductorClient)
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

      this.stompClient.activate()
    })
  }

  stop() {
    this.subscription.unsubscribe()
    this.stompClient.deactivate()
  }
}

export default MessageForwarder
