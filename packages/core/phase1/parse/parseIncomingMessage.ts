import type { AnnotatedHearingOutcome } from "../../types/AnnotatedHearingOutcome"
import type { PncUpdateDataset } from "../../types/PncUpdateDataset"
import getMessageType from "../lib/getMessageType"
import { parseAhoXml } from "./parseAhoXml"
import parseSpiResult from "./parseSpiResult"
import transformSpiToAho from "./transformSpiToAho"
import { parsePncUpdateDataSetXml } from "./parsePncUpdateDataSetXml"

const parseIncomingMessage = (message: string): [AnnotatedHearingOutcome | PncUpdateDataset, string] => {
  let result: AnnotatedHearingOutcome | PncUpdateDataset | Error
  const messageType = getMessageType(message)

  if (messageType === "SPIResults") {
    const spiResult = parseSpiResult(message)
    result = transformSpiToAho(spiResult)
  } else if (messageType === "HearingOutcome") {
    result = parseAhoXml(message)
  } else if (messageType === "PncUpdateDataset") {
    result = parsePncUpdateDataSetXml(message)
  } else {
    throw new Error("Invalid incoming message format")
  }

  if (result instanceof Error) {
    throw result
  }

  return [result, messageType]
}

export default parseIncomingMessage
