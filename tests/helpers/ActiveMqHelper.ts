import type { Client } from "stompit"
import { ConnectFailover } from "stompit"
import type Subscription from "stompit/lib/client/Subscription"

type Options = {
  url: string
  login: string
  password: string
}

const getMessage = (client: Client, queueName: string, timeoutAmount = 500): Promise<string | null> =>
  new Promise((resolve, reject) => {
    // eslint-disable-next-line prefer-const
    let timeout: NodeJS.Timeout
    // eslint-disable-next-line prefer-const
    let subscription: Subscription
    const callback: Client.MessageCallback = (error1, message) => {
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
    subscription = client.subscribe({ destination: queueName, ack: "client" }, callback)
    timeout = setTimeout(() => {
      subscription.unsubscribe()
      resolve(null)
    }, timeoutAmount)
  })

export default class ActiveMqHelper {
  private url: string

  private options: unknown

  private client?: Client

  constructor({ url, login, password }: Options) {
    this.url = url
    this.options = {
      connect: {
        connectHeaders: {
          login: login,
          passcode: password,
          "heart-beat": "5000,5000"
        }
      }
    }
    if (/stomp\+ssl/.test(url)) {
      this.url = url.replace(/stomp\+ssl/g, "ssl")
    }
  }

  connectAsync(): Promise<Client> {
    return new Promise((resolve, reject) => {
      const listener = (error: Error | null, client: Client) => {
        if (error) {
          reject(error)
        } else {
          resolve(client)
        }
      }
      const connectionManager = new ConnectFailover(this.url, this.options as ConnectFailover.ConnectFailoverOptions)

      return connectionManager.connect(listener)
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

  async sendMessage(queueName: string, message: string): Promise<void> {
    const client = await this.connectIfRequired()
    const headers = {
      destination: `/queue/${queueName}`
    }

    return new Promise((resolve, reject) => {
      const writable = client.send(headers)

      writable.write(message)
      writable.end()
      this.client?.disconnect((error) => {
        this.client = undefined
        if (error) {
          reject(error)
        } else {
          resolve()
        }
      })
    })
  }

  async getMessages(queueName: string, timeout = 500): Promise<string[]> {
    const messages = []
    const client = await this.connectIfRequired()
    let waiting = true

    while (waiting) {
      // eslint-disable-next-line no-await-in-loop
      const message = await getMessage(client, queueName, timeout)
      if (message) {
        messages.push(message)
      } else {
        waiting = false
      }
    }
    return messages
  }

  disconnect(): undefined | void {
    return this.client?.disconnect()
  }
}
