import type { PromiseResult } from "@moj-bichard7/core/phase1/comparison/types/Result"
import { isError } from "@moj-bichard7/core/phase1/comparison/types/Result"
import type MqConfig from "common/mq/MqConfig"
import type { Client, connect } from "stompit"
import { ConnectFailover } from "stompit"
import deconstructServers from "./deconstructServers"

const reconnectOptions: ConnectFailover.ConnectFailoverOptions = {
  initialReconnectDelay: 1000,
  maxReconnectDelay: 3000,
  maxReconnects: 2,
  useExponentialBackOff: false
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
}
