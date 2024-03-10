import { isError, type Result } from "@moj-bichard7/common/types/Result"
import logger from "@moj-bichard7/common/utils/logger"
import crypto from "crypto"
import { fromZodError } from "zod-validation-error"
import type { AnnotatedHearingOutcome } from "../../../types/AnnotatedHearingOutcome"
import { fullResultedCaseMessageParsedXmlSchema } from "../../schemas/spiResult"
import {
  extractIncomingMessage,
  getDataStreamContent,
  getResultedCaseMessage,
  getSystemId
} from "./extractIncomingMessageData"
import transformResultedCaseMessageToAho from "./transformResultedCaseMessageToAho"

export type TransformedOutput = {
  aho: AnnotatedHearingOutcome
  messageHash: string
  systemId: string
}

const generateHash = (text: string) => crypto.createHash("sha256").update(text, "utf-8").digest("hex")

const transformIncomingMessageToAho = (incomingMessage: string): Result<TransformedOutput> => {
  const message = extractIncomingMessage(incomingMessage)
  if (isError(message)) {
    return message
  }

  const systemId = getSystemId(message)
  const convertedXml = getDataStreamContent(message)
  const messageHash = generateHash(convertedXml)

  const parsedResultedCaseMessage = getResultedCaseMessage(message)
  const resultedCaseMessage = fullResultedCaseMessageParsedXmlSchema.safeParse(parsedResultedCaseMessage)

  if (!resultedCaseMessage.success) {
    const validationError = fromZodError(resultedCaseMessage.error)
    logger.info(validationError.details)
    return validationError
  }

  const aho = transformResultedCaseMessageToAho(
    resultedCaseMessage.data.ResultedCaseMessage,
    message.RouteData.RequestFromSystem.CorrelationID
  )

  return { aho, messageHash, systemId: systemId }
}

export default transformIncomingMessageToAho
