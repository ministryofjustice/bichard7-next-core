import type { AnnotatedHearingOutcome } from "core/phase1/src/types/AnnotatedHearingOutcome"
import getMessageType from "../lib/getMessageType"
import { parseAhoXml } from "./parseAhoXml"
import parseSpiResult from "./parseSpiResult"
import transformSpiToAho from "./transformSpiToAho/transformSpiToAho"

const parseIncomingMessage = (message: string): [AnnotatedHearingOutcome, string] => {
  let hearingOutcome: AnnotatedHearingOutcome | Error
  const messageType = getMessageType(message)

  if (messageType === "SPIResults") {
    const spiResult = parseSpiResult(message)
    hearingOutcome = transformSpiToAho(spiResult)
  } else if (messageType === "HearingOutcome") {
    hearingOutcome = parseAhoXml(message)
  } else {
    throw new Error("Invalid incoming message format")
  }

  if (hearingOutcome instanceof Error) {
    throw hearingOutcome
  }

  return [hearingOutcome, messageType]
}

export default parseIncomingMessage
