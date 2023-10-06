import logger from "@moj-bichard7/common/utils/logger"
import { Client } from "@stomp/stompjs"

const createStompClient = (): Client => {
  const { MQ_USER, MQ_PASSWORD, MQ_URL } = process.env

  if (!MQ_USER || !MQ_PASSWORD || !MQ_URL) {
    throw Error("MQ environment variables must all have value.")
  }

  const brokerURL = MQ_URL.replace(/\s/g, "")
  const match = brokerURL.match(/failover:\((.+)\)/i)
  const brokerUrls = match && match[1] ? match[1].split(",") : [brokerURL]

  let activeBrokerIndex = 0

  const client = new Client({
    brokerURL: brokerUrls[0],
    connectHeaders: {
      login: MQ_USER,
      passcode: MQ_PASSWORD
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
