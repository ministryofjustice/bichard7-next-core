import type { Client, connect } from "stompit"
import { ConnectFailover } from "stompit"
import type { PromiseResult } from "../Result"
import { isError } from "../Result"
import type MqConfig from "./MqConfig"
import deconstructServers from "./deconstructServers"

type SubscriptionCallback = (message: string) => void

const reconnectOptions: ConnectFailover.ConnectFailoverOptions = {
  initialReconnectDelay: 1000,
  maxReconnectDelay: 3000,
  maxReconnects: 2,
  useExponentialBackOff: false
}

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

export default class MqGateway {
  private readonly connectionOptions: connect.ConnectOptions[]

  private client: Client | null

  constructor(config: MqConfig) {
    this.connectionOptions = deconstructServers(config)
  }

  private connectAsync(): PromiseResult<Client> {
    return new Promise((resolve, reject) => {
      const connectionManager = new ConnectFailover(this.connectionOptions, reconnectOptions)
      connectionManager.connect((error: Error | null, client: Client) => {
        if (error) {
          reject(error)
        } else {
          resolve(client)
        }
      })
    })
  }

  protected async connectIfRequired(): PromiseResult<Client> {
    if (!this.client) {
      const connectionResult = await this.connectAsync()

      if (isError(connectionResult)) {
        return connectionResult
      }

      this.client = connectionResult
    }

    return this.client
  }

  async sendMessage(message: string, queueName: string): PromiseResult<void> {
    const client = await this.connectIfRequired()

    if (isError(client)) {
      return client
    }

    const sendResult = await this._sendMessage(message, queueName)
    const disposeResult = await this.dispose()

    return isError(sendResult) ? sendResult : disposeResult
  }

  private _sendMessage(message: string, queueName: string): Promise<void> {
    const headers = {
      destination: `/queue/${queueName}`
    }

    return new Promise<void>((resolve, reject) => {
      if (!this.client) {
        reject(new Error("MQ connection has not been established"))
        return
      }

      const options: Client.SendOptions = {
        onReceipt: () => resolve(),
        onError: (error: Error) => reject(error)
      }

      const writable = this.client.send(headers, options)

      writable.write(message)
      writable.end()
    })
  }

  async dispose(): PromiseResult<void> {
    if (!this.client) {
      return undefined
    }

    const disconnectionResult = await this.disconnectAsync().catch((error: Error) => error)

    if (!isError(disconnectionResult)) {
      this.client = null
    }

    return disconnectionResult
  }

  private disconnectAsync(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.client!.disconnect((error: Error | null) => {
        if (error) {
          reject(error)
        } else {
          resolve()
        }
      })
    })
  }

  async subscribe(queueName: string, callback: SubscriptionCallback): Promise<void> {
    await this.connectIfRequired()

    const headers = {
      destination: queueName
    }

    this.client?.subscribe(headers, (error: Error | null, message: Client.Message) => {
      if (error) {
        console.error(error)
      } else {
        readMessage(message)
          .then((messageContent) => callback(messageContent))
          .catch((e) => e)
      }
    })
  }
}
