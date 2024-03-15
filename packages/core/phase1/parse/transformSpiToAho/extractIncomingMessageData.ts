import { type Result } from "@moj-bichard7/common/types/Result"
import logger from "@moj-bichard7/common/utils/logger"
import { XMLParser } from "fast-xml-parser"
import { fromZodError } from "zod-validation-error"
import { incomingMessageSchema } from "../../schemas/incomingMessage"
import type IncomingMessage from "../../../types/IncomingMessage"

const parserDefaults = {
  ignoreAttributes: true,
  removeNSPrefix: true,
  parseTagValue: false,
  trimValues: true,
  processEntities: false
}

export const extractIncomingMessage = (incomingMessage: string): Result<IncomingMessage> => {
  try {
    const parser = new XMLParser(parserDefaults)
    const rawParsedObj = parser.parse(incomingMessage, true) as unknown
    const parsedMessage = incomingMessageSchema.safeParse(rawParsedObj)

    if (!parsedMessage.success) {
      const validationError = fromZodError(parsedMessage.error)

      logger.info(validationError.details)
      return validationError
    }

    return parsedMessage.data
  } catch (e) {
    return e as Error
  }
}

export const getSystemId = (message: IncomingMessage): string =>
  message.RouteData.RequestFromSystem.SourceID ?? "UNKNOWN"

export const getCorrelationId = (message: IncomingMessage) => message.RouteData.RequestFromSystem.CorrelationID

const unescape = (input: string) =>
  input
    .replace(/&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&gt;/g, ">")
    .replace(/&lt;/g, "<")
    .replace(/&amp;/g, "&")

export const getDataStreamContent = (message: IncomingMessage) =>
  unescape(message.RouteData.DataStream.DataStreamContent)

export const getResultedCaseMessage = (message: IncomingMessage) => {
  const parser = new XMLParser({ ...parserDefaults, processEntities: true })
  const convertedXml = getDataStreamContent(message)
  return parser.parse(convertedXml) as unknown
}

export const extractXMLEntityContent = (content: string, tag: string) => {
  if (!content) {
    return "UNKNOWN"
  }

  const parts = content.match(new RegExp(`<[^:]*?:?${tag}>([^<]*)<\/[^:]*?:?${tag}>`))
  if (!parts || !parts.length) {
    return "UNKNOWN"
  }

  return parts[1]?.trim()
}
