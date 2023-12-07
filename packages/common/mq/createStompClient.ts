import { Client } from "@stomp/stompjs"
import logger from "../utils/logger"
import type MqConfig from "./MqConfig"

const createStompClient = (mqConfig: MqConfig): Client => {
  const brokerURL = mqConfig.url.replace(/\s/g, "")
  const match = /failover:\((.+)\)/i.exec(brokerURL)

  let brokerUrls: string[]

  if (match) {
    brokerUrls = match[1].split(",")
  } else {
    brokerUrls = [brokerURL]
  }

  let activeBrokerIndex = 0

  const client = new Client({
    brokerURL: brokerUrls[0],
    connectHeaders: {
      login: mqConfig.username,
      passcode: mqConfig.password
    },
    beforeConnect: () => {
      client.brokerURL = brokerUrls[activeBrokerIndex]
      logger.info(`Connecting to ${client.brokerURL}`)
      activeBrokerIndex += 1
      if (!brokerUrls[activeBrokerIndex]) {
        activeBrokerIndex = 0
      }
    }
  })
  return client
}

export default createStompClient
