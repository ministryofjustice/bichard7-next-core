import { Client } from "@stomp/stompjs"

import type MqConfig from "./MqConfig"

import logger from "../utils/logger"

const createStompClient = (mqConfig: MqConfig): Client => {
  const brokerURL = mqConfig.url.replace(/\s/g, "")
  const match = brokerURL.match(/failover:\((.+)\)/i)
  const brokerUrls = match && match[1] ? match[1].split(",") : [brokerURL]

  let activeBrokerIndex = 0

  const client = new Client({
    beforeConnect: () => {
      client.brokerURL = brokerUrls[activeBrokerIndex]
      logger.info(`Connecting to ${client.brokerURL}`)
      activeBrokerIndex += 1
      if (!brokerUrls[activeBrokerIndex]) {
        activeBrokerIndex = 0
      }
    },
    brokerURL: brokerUrls[0],
    connectHeaders: {
      login: mqConfig.username,
      passcode: mqConfig.password
    }
  })
  return client
}

export default createStompClient
