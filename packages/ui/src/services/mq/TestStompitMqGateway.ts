import type { PromiseResult } from "./types/Result"
import { isError } from "./types/Result"
import type { Client } from "stompit"
import StompitMqGateway from "./StompitMqGateway"

const readMessage = (message: Client.Message): PromiseResult<string> => {
  return new Promise<string>((resolve, reject) => {
    message.readString("utf-8", (error: Error | null, buffer?: string) => {
      if (error) {
        reject(error)
      } else if (!buffer) {
        reject(new Error("No buffer returned for message"))
      } else {
        resolve(buffer)
      }
    })
  })
}

const getMessage = (client: Client, queueName: string): Promise<Client.Message> => {
  const headers = {
    destination: queueName
  }

  return new Promise<Client.Message>((resolve, reject) => {
    const callback: Client.MessageCallback = (error: Error | null, message: Client.Message) => {
      if (error) {
        reject(error)
      } else {
        resolve(message)
      }
    }

    client.subscribe(headers, callback)
  })
}

export default class TestStompitMqGateway extends StompitMqGateway {
  async getMessage(queueName: string): PromiseResult<string> {
    const client = await this.connectIfRequired()

    if (isError(client)) {
      return client
    }

    try {
      const message = await getMessage(client, queueName)
      const messageContent = await readMessage(message)
      return messageContent
    } catch (error) {
      return <Error>error
    }
  }
}
