import type { Client } from "stompit"
import type Subscription from "stompit/lib/client/Subscription"

import { ConnectFailover } from "stompit"

const getMessage = (client: Client, queueName: string, timeoutAmount = 500): Promise<null | string> =>
  new Promise((resolve, reject) => {
    // eslint-disable-next-line prefer-const
    let subscription: Subscription
    // eslint-disable-next-line prefer-const
    let timeout: NodeJS.Timeout
    const callback = (error1: Error | null, message: Client.Message) => {
      if (error1) {
        reject(error1)
      } else {
        clearTimeout(timeout)
        message.readString("utf-8", (error2, buffer) => {
          if (error2) {
            reject(error2)
          } else if (!buffer) {
            reject(new Error("No buffer returned for message"))
          } else {
            client.ack(message)
            try {
              subscription.unsubscribe()
            } catch (e) {
              console.error(e)
            }

            resolve(buffer.toString())
          }
        })
      }
    }

    subscription = client.subscribe({ ack: "client", destination: queueName }, callback)
    timeout = setTimeout(() => {
      subscription.unsubscribe()
      resolve(null)
    }, timeoutAmount)
  })

type ActiveMqConfig = {
  login: string
  password: string
  url: string
}

class ActiveMqHelper {
  client: Client | null = null
  options: ConnectFailover.ConnectFailoverOptions
  url: string

  constructor(config: ActiveMqConfig) {
    this.url = config.url
    this.options = {
      connect: {
        connectHeaders: {
          "heart-beat": "5000,5000",
          login: config.login,
          passcode: config.password
        }
      }
      // Bug in stompit with types
    } as unknown as ConnectFailover.ConnectFailoverOptions
    if (/stomp\+ssl/.test(this.url)) {
      this.url = this.url.replace(/stomp\+ssl/g, "ssl")
    }
  }

  connectAsync(): Promise<Client | Error> {
    return new Promise((resolve, reject) => {
      const listener = (error: Error | null, client: Client) => {
        if (error) {
          reject(error)
        } else {
          resolve(client)
        }
      }

      const connectionManager = new ConnectFailover(this.url, this.options)

      connectionManager.connect(listener)
    })
  }

  async connectIfRequired() {
    if (!this.client) {
      const connectionResult = await this.connectAsync()

      if (connectionResult instanceof Error) {
        throw connectionResult
      }

      this.client = connectionResult
    }

    return this.client
  }

  disconnect(): undefined | void {
    return this.client?.disconnect()
  }

  async getMessages(queueName: string, timeout = 500): Promise<string[]> {
    const messages = []
    const client = await this.connectIfRequired()
    let waiting = true

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

  async sendMessage(queueName: string, message: string): Promise<Error | void> {
    const client = await this.connectIfRequired()
    const headers = {
      destination: `/queue/${queueName}`
    }

    return new Promise((resolve, reject) => {
      const writable = client.send(headers)

      writable.write(message)
      writable.end()
      this.client?.disconnect((error) => {
        this.client = null
        if (error) {
          reject(error)
        } else {
          resolve()
        }
      })
    })
  }
}

export default ActiveMqHelper
