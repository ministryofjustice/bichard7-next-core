import { isError, type Result } from "@moj-bichard7/common/types/Result"
import logger from "@moj-bichard7/common/utils/logger"
import crypto from "crypto"
import type { AnnotatedHearingOutcome } from "../../../types/AnnotatedHearingOutcome"
import { fullResultedCaseMessageParsedXmlSchema } from "../../schemas/spiResult"
import {
  extractIncomingMessage,
  getDataStreamContent,
  getResultedCaseMessage,
  getSystemId
} from "./extractIncomingMessageData"
import populateCase from "./populateCase"
import populateHearing from "./populateHearing"

export type TransformedOutput = {
  aho: AnnotatedHearingOutcome
  messageHash: string
  systemId: string
}

const generateHash = (text: string) => crypto.createHash("sha256").update(text, "utf-8").digest("hex")

const transformIncomingMessageToAho = (incomingMessage: string): Result<TransformedOutput> => {
  const message = extractIncomingMessage(incomingMessage)
  if (isError(message)) {
    logger.error(message)
    return new Error("Could not extract incoming message")
  }

  const systemId = getSystemId(message)
  const convertedXml = getDataStreamContent(message)
  const messageHash = generateHash(convertedXml)

  const parsedResultedCaseMessage = getResultedCaseMessage(message)
  const resultedCaseMessage = fullResultedCaseMessageParsedXmlSchema.safeParse(parsedResultedCaseMessage)

  if (!resultedCaseMessage.success) {
    logger.error(resultedCaseMessage)
    return new Error("Error parsing incoming message datastream element")
  }

  const aho = {
    AnnotatedHearingOutcome: {
      HearingOutcome: {
        Hearing: populateHearing(
          message.RouteData.RequestFromSystem.CorrelationID,
          resultedCaseMessage.data.ResultedCaseMessage
        ),
        Case: populateCase(resultedCaseMessage.data.ResultedCaseMessage)
      }
    },
    Exceptions: []
  }

  return { aho, messageHash, systemId: systemId }
}

export default transformIncomingMessageToAho
