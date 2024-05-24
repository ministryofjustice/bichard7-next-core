import type { Client } from "@stomp/stompjs"
import promisePoller from "promise-poller"
import type MqConfig from "../../mq/MqConfig"
import createStompClient from "../../mq/createStompClient"

Object.assign(global, { WebSocket: require("ws") })

export default class MqListener {
  messages: string[] = []

  constructor(
    mqConfig: MqConfig,
    public client: Client = createStompClient(mqConfig)
  ) {}

  listen(queue: string) {
    this.client.onConnect = () => {
      this.client.subscribe(queue, (message) => {
        this.messages.push(message.body)
      })
    }

    this.client.activate()
  }

  async waitForMessage() {
    const message = await promisePoller({
      taskFn: () => {
        if (this.messages.length) {
          return Promise.resolve(this.messages[0])
        }

        return Promise.reject("No messages yet")
      },
      retries: 300, // 30 seconds
      interval: 100 // ms
    }).catch(() => {
      throw new Error("Failed to fetch any messages from MQ")
    })

    return message
  }

  stop() {
    this.client.deactivate()
  }

  clearMessages() {
    this.messages = []
  }
}
