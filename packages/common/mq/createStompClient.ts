import { Client } from "@stomp/stompjs"
import logger from "../utils/logger"
import type MqConfig from "./MqConfig"

const createStompClient = (mqConfig: MqConfig): Client => {
  const brokerURL = mqConfig.url.replace(/\s/g, "")
  const match = /failover:\((.+)\)/i.exec(brokerURL)
  const brokerUrls = match && match[1] ? match[1].split(",") : [brokerURL]

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
