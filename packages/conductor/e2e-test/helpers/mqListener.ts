import type MqConfig from "@moj-bichard7/common/mq/MqConfig"
import createStompClient from "@moj-bichard7/common/mq/createStompClient"
import type { Client } from "@stomp/stompjs"

Object.assign(global, { WebSocket: require("ws") })

class MqListener {
  messages: string[] = []

  client: Client

  constructor(mqConfig: MqConfig) {
    this.client = createStompClient(mqConfig)
  }

  async listen(queue: string) {
    this.client.onConnect = () => {
      this.client.subscribe(queue, (message) => {
        this.messages.push(message.body)
      })
    }

    await this.client.activate()
  }

  stop() {
    this.client.deactivate()
  }

  clearMessages() {
    this.messages = []
  }
}

export default MqListener
