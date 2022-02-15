import type { Client } from "stompit"
import { ConnectFailover } from "stompit"

type Options = {
  url: string
  login: string
  password: string
}

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
}
