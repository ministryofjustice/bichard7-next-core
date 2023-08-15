import type { PromiseResult } from "core/phase1/src/comparison/types/Result"
import { isError } from "core/phase1/src/comparison/types/Result"
import type { Client } from "stompit"
import type Subscription from "stompit/lib/client/Subscription"
import MqGateway from "./MqGateway"

const readMessage = (message: Client.Message): Promise<string> => {
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

const getMessage = (client: Client, queueName: string, timeoutMs: number): Promise<string | null> =>
  new Promise((resolve, reject) => {
    // eslint-disable-next-line prefer-const
    let subscription: Subscription
    // eslint-disable-next-line prefer-const
    let timeout: NodeJS.Timeout
    const callback = async (error1: Error | null, message: Client.Message) => {
      if (error1) {
        reject(error1)
      } else {
        clearTimeout(timeout)
        await readMessage(message)
          .then((body: string) => {
            client.ack(message)
            try {
              subscription.unsubscribe()
            } catch (e) {
              console.error(e)
            }
            resolve(body)
          })
          .catch((e) => reject(e))
      }
    }
    subscription = client.subscribe({ destination: queueName, ack: "client" }, callback)
    timeout = setTimeout(() => {
      subscription.unsubscribe()
      resolve(null)
    }, timeoutMs)
  })

export default class TestMqGateway extends MqGateway {
  async getMessage(queueName: string, timeout = 500): PromiseResult<string | null> {
    const client = await this.connectIfRequired()

    if (isError(client)) {
      return client
    }

    try {
      return await getMessage(client, queueName, timeout)
    } catch (error) {
      return <Error>error
    }
  }

  async getMessages(queueName: string, timeout = 500) {
    const messages = []
    const client = await this.connectIfRequired()
    let waiting = true

    if (isError(client)) {
      return client
    }

    while (waiting) {
      const message = await getMessage(client, queueName, timeout)
      if (message) {
        messages.push(message)
      } else {
        waiting = false
      }
    }
    return messages
  }
}
