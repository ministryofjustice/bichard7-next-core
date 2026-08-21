import type { WorkflowExecutor } from "@io-orkes/conductor-javascript"
import { isError } from "@moj-bichard7/common/types/Result"
import logger from "@moj-bichard7/common/utils/logger"
import type { Client, Message, StompSubscription } from "@stomp/stompjs"
import type { Sql } from "postgres"
import { WebSocket } from "ws"
import forwardMessage from "./forwardMessage/forwardMessage"

Object.assign(global, { WebSocket })

const sourceQueue = process.env.SOURCE_QUEUE ?? "PHASE_1_RESUBMIT_QUEUE"

class MessageForwarder {
  private subscription: StompSubscription

  constructor(
    private stompClient: Client,
    private workflowExecutor: WorkflowExecutor,
    private database: Sql
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
              const forwardMessageResult = await forwardMessage(
                message.body,
                this.stompClient,
                this.workflowExecutor,
                this.database
              )
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

  async stop(): Promise<void> {
    this.subscription.unsubscribe()
    await this.stompClient.deactivate()
    await this.database.end()
  }
}

export default MessageForwarder
