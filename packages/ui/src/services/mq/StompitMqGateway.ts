import type { Client, connect } from "stompit"
import { ConnectFailover } from "stompit"
import deconstructServers from "./deconstructServers"
import MqConfig from "./types/MqConfig"
import MqGateway from "./types/MqGateway"
import type { PromiseResult } from "./types/Result"
import { isError } from "./types/Result"

const reconnectOptions: ConnectFailover.ConnectFailoverOptions = {
  initialReconnectDelay: 1000,
  maxReconnectDelay: 3000,
  maxReconnects: 2,
  useExponentialBackOff: false
}

export default class StompitMqGateway implements MqGateway {
  private readonly connectionOptions: connect.ConnectOptions[]

  private client: Client | null

  constructor(config: MqConfig) {
    this.connectionOptions = deconstructServers(config)
    this.client = null
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

  async execute(message: string, queueName: string): PromiseResult<void> {
    const client = await this.connectIfRequired()

    if (isError(client)) {
      return client
    }

    const sendResult = await this.sendMessage(message, queueName)
    const disposeResult = await this.dispose()

    return isError(sendResult) ? sendResult : disposeResult
  }

  private sendMessage(message: string, queueName: string): Promise<void> {
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
      if (this.client === null) {
        reject("Cannot disconnect. Client is undefined")
        return
      }

      this.client.disconnect((error: Error | null) => {
        if (error) {
          reject(error)
        } else {
          resolve()
        }
      })
    })
  }
}
