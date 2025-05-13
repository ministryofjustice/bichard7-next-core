import type { AnnotatedHearingOutcome } from "../../types/AnnotatedHearingOutcome"
import type { PncUpdateDataset } from "../../types/PncUpdateDataset"

import { parseAhoXml } from "../../lib/parse/parseAhoXml"
import { parsePncUpdateDataSetXml } from "../../lib/parse/parsePncUpdateDataSetXml"
import parseSpiResult from "../../lib/parse/parseSpiResult"
import transformSpiToAho from "../../lib/parse/transformSpiToAho"
import getMessageType from "../../phase1/lib/getMessageType"

export type ParseIncomingMessageResult = HearingOutcomeResult | PncUpdateDatasetResult | SPIResultsResult

type HearingOutcomeResult = {
  message: AnnotatedHearingOutcome
  type: "AnnotatedHearingOutcome"
}

type PncUpdateDatasetResult = {
  message: PncUpdateDataset
  type: "PncUpdateDataset"
}

type SPIResultsResult = {
  message: AnnotatedHearingOutcome
  type: "SPIResults"
}

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
