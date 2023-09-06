import { type Result } from "@moj-bichard7/common/types/Result"
import logger from "@moj-bichard7/common/utils/logger"
import { XMLParser } from "fast-xml-parser"
import { incomingMessageSchema } from "../../schemas/incomingMessage"
import type IncomingMessage from "../../types/IncomingMessage"

const parser = new XMLParser({
  ignoreAttributes: true,
  removeNSPrefix: true,
  parseTagValue: false,
  trimValues: true,
  processEntities: false
})

export const extractIncomingMessage = (incomingMessage: string): Result<IncomingMessage> => {
  const rawParsedObj = parser.parse(incomingMessage) as unknown
  const parsedMessage = incomingMessageSchema.safeParse(rawParsedObj)

  if (!parsedMessage.success) {
    logger.error(parsedMessage)
    return new Error("Error parsing incoming message")
  }

  return parsedMessage.data
}

export const getSystemId = (message: IncomingMessage) => message.RouteData.RequestFromSystem.SourceID

export const getDataStreamContent = (message: IncomingMessage) =>
  message.RouteData.DataStream.DataStreamContent.replace(/&lt;/g, "<").replace(/&gt;/g, ">")

export const getResultedCaseMessage = (message: IncomingMessage) => {
  const convertedXml = getDataStreamContent(message)
  return parser.parse(convertedXml) as unknown
}
