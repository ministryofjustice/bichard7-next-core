import logger from "@moj-bichard7/common/utils/logger"
import { type Client } from "@stomp/stompjs"

const destination = process.env.DESTINATION ?? "HEARING_OUTCOME_INPUT_QUEUE"

export const sendToResubmissionQueue = (client: Client, message: string, correlationId: string) => {
  client.publish({ destination: destination, body: message, skipContentLengthHeader: true })
  logger.info(`Sent message to MQ (${correlationId})`)
}
