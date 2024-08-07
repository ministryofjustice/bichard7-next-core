import { parseAhoXml } from "../../lib/parse/parseAhoXml"
import parseSpiResult from "../../lib/parse/parseSpiResult"
import transformSpiToAho from "../../lib/parse/transformSpiToAho"
import getMessageType from "../../phase1/lib/getMessageType"
import { parsePncUpdateDataSetXml } from "../../phase2/parse/parsePncUpdateDataSetXml"
import type { AnnotatedHearingOutcome } from "../../types/AnnotatedHearingOutcome"
import type { PncUpdateDataset } from "../../types/PncUpdateDataset"

type HearingOutcomeResult = {
  type: "AnnotatedHearingOutcome"
  message: AnnotatedHearingOutcome
}

type SPIResultsResult = {
  type: "SPIResults"
  message: AnnotatedHearingOutcome
}

type PncUpdateDatasetResult = {
  type: "PncUpdateDataset"
  message: PncUpdateDataset
}

type ParseIncomingMessageResult = HearingOutcomeResult | PncUpdateDatasetResult | SPIResultsResult

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
