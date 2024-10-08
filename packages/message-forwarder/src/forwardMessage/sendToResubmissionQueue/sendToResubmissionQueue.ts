import logger from "@moj-bichard7/common/utils/logger"
import { type Client } from "@stomp/stompjs"
import Phase from "@moj-bichard7/core/types/Phase"

// TODO: this needs a better name.
const destination = process.env.DESTINATION ?? "HEARING_OUTCOME_INPUT_QUEUE"

export const sendToResubmissionQueue = (
  client: Client,
  message: string,
  correlationId: string,
  phase: Phase = Phase.HEARING_OUTCOME
): Error | void => {
  try {
    client.publish({ destination: destination, body: message, skipContentLengthHeader: true })

    logger.info({
      event: `message-forwarder:sent-to-mq:${phase === Phase.HEARING_OUTCOME ? "phase-1" : "phase-2"}`,
      correlationId
    })
  } catch (e) {
    return e as Error
  }
}
