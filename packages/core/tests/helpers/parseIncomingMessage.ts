import type { ParseIncomingMessageResult } from "../types/ParseIncomingMessageResult"

import { parseAhoXml } from "../../lib/parse/parseAhoXml"
import { parsePncUpdateDataSetXml } from "../../lib/parse/parsePncUpdateDataSetXml"
import parseSpiResult from "../../lib/parse/parseSpiResult"
import transformSpiToAho from "../../lib/parse/transformSpiToAho"
import getMessageType from "../../phase1/lib/getMessageType"

const parseIncomingMessage = (message: string): ParseIncomingMessageResult => {
  const messageType = getMessageType(message)

  if (messageType === "SPIResults") {
    const spiResult = parseSpiResult(message)
    const parsedMessage = transformSpiToAho(spiResult)
    return { type: messageType, message: parsedMessage }
  } else if (messageType === "AnnotatedHearingOutcome") {
    const parsedMessage = parseAhoXml(message)
    if (parsedMessage instanceof Error) {
      throw parsedMessage
    }

    return { type: messageType, message: parsedMessage }
  } else if (messageType === "PncUpdateDataset") {
    const parsedMessage = parsePncUpdateDataSetXml(message)
    if (parsedMessage instanceof Error) {
      throw parsedMessage
    }

    return { type: messageType, message: parsedMessage }
  } else {
    throw new Error("Invalid incoming message format")
  }
}

export default parseIncomingMessage
