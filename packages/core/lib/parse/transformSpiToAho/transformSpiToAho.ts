import type { IncomingMessageParsedXml } from "../../../phase1/types/SpiResult"
import type { AnnotatedHearingOutcome } from "../../../types/AnnotatedHearingOutcome"
import transformResultedCaseMessageToAho from "./transformResultedCaseMessageToAho"

export default (spiResult: IncomingMessageParsedXml): AnnotatedHearingOutcome =>
  transformResultedCaseMessageToAho(
    spiResult.DeliverRequest.Message.ResultedCaseMessage,
    spiResult.DeliverRequest.MessageIdentifier
  )
