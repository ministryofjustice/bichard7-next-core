import logger from "@moj-bichard7/common/utils/logger"
import Phase from "@moj-bichard7/core/types/Phase"
import { type Client } from "@stomp/stompjs"

// TODO: this needs a better name.
const destination = process.env.DESTINATION ?? "HEARING_OUTCOME_INPUT_QUEUE"

export const sendToResubmissionQueue = (
  client: Client,
  message: string,
  correlationId: string,
  phase: Phase = Phase.HEARING_OUTCOME
): Error | void => {
  try {
    client.publish({ body: message, destination: destination, skipContentLengthHeader: true })

    logger.info({
      correlationId,
      event: `message-forwarder:sent-to-mq:${phase === Phase.HEARING_OUTCOME ? "phase-1" : "phase-2"}`
    })
  } catch (e) {
    return e as Error
  }
}
