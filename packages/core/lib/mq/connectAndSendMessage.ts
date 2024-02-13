import { Client } from "@stomp/stompjs"
import { WebSocket } from "ws"

Object.assign(global, { WebSocket })

const createStompClient = (): Client => {
  const { MQ_URL, MQ_AUTH } = process.env

  if (!MQ_URL || !MQ_AUTH) {
    throw Error("MQ environment variables must all have value.")
  }

  const { username, password } = JSON.parse(MQ_AUTH)
  if (!username || !password) {
    throw Error("MQ_AUTH environment variable set incorrectly")
  }

  const brokerURL = MQ_URL.replace(/\s/g, "")
  const match = brokerURL.match(/failover:\((.+)\)/i)
  const brokerUrls = match && match[1] ? match[1].split(",") : [brokerURL]

  let activeBrokerIndex = 0

  const client = new Client({
    brokerURL: brokerUrls[0],
    connectHeaders: {
      login: username,
      passcode: password
    },
    beforeConnect: () => {
      client.brokerURL = brokerUrls[activeBrokerIndex]
      activeBrokerIndex += 1
      if (!brokerUrls[activeBrokerIndex]) {
        activeBrokerIndex = 0
      }
    }
  })
  return client
}

const connectAndSendMessage = (destination: string, body: string, timeoutMs = 5000): Promise<void> => {
  return new Promise((resolve, reject) => {
    const client = createStompClient()
    const timeout = setTimeout(() => {
      client.deactivate()
      reject(new Error("Timed out sending message"))
    }, timeoutMs)
    client.onConnect = () => {
      client.publish({ destination, body, skipContentLengthHeader: true })
      client.deactivate()
      clearTimeout(timeout)
      resolve()
    }
    client.onStompError = (frame) => {
      reject(new Error(frame.headers.message ?? "Error sending message"))
    }
    client.activate()
  })
}

export default connectAndSendMessage
