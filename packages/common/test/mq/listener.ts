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

  clearMessages() {
    this.messages = []
  }

  listen(queue: string) {
    this.client.onConnect = () => {
      this.client.subscribe(queue, (message) => {
        this.messages.push(message.body)
      })
    }

    this.client.activate()
  }

  stop() {
    this.client.deactivate()
  }

  async waitForMessage() {
    const message = await promisePoller({
      interval: 100, // ms
      retries: 300, // 30 seconds
      taskFn: () => {
        if (this.messages.length) {
          return Promise.resolve(this.messages[0])
        }

        return Promise.reject("No messages yet")
      }
    }).catch(() => {
      throw new Error("Failed to fetch any messages from MQ")
    })

    return message
  }
}
