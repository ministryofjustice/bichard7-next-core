import type { AnnotatedHearingOutcome } from "../../../types/AnnotatedHearingOutcome"
import type { IncomingMessageParsedXml } from "../../types/SpiResult"
import transformResultedCaseMessageToAho from "./transformResultedCaseMessageToAho"

export default (spiResult: IncomingMessageParsedXml): AnnotatedHearingOutcome =>
  transformResultedCaseMessageToAho(
    spiResult.DeliverRequest.Message.ResultedCaseMessage,
    spiResult.DeliverRequest.MessageIdentifier
  )
