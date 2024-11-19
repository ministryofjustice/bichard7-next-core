import logger from "@moj-bichard7/common/utils/logger"
import type { Client } from "stompit"
import { ConnectFailover } from "stompit"
import createMqConfig from "./createMqConfig"
import deconstructServers from "./deconstructServers"

const config = createMqConfig()

const connectionOptions = deconstructServers(config)
const reconnectOptions: ConnectFailover.ConnectFailoverOptions = {
  initialReconnectDelay: 1000,
  maxReconnectDelay: 3000,
  maxReconnects: 2,
  useExponentialBackOff: false
}

const connectAndSendMessage = (destination: string, body: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const connectionManager = new ConnectFailover(connectionOptions, reconnectOptions)
    connectionManager.connect((error: Error | null, client: Client) => {
      if (error) {
        reject(error)
        return
      }

      const cleanup = () => {
        client.disconnect((e: Error | null) => {
          if (e) {
            logger.error(e)
          }

          resolve()
        })
      }

      const options: Client.SendOptions = {
        onReceipt: cleanup,
        onError: reject
      }

      const writable = client.send({ destination: `/queue/${destination}` }, options)
      writable.write(body)
      writable.end()
    })
  })
}

export default connectAndSendMessage
