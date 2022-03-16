import { XMLParser } from "fast-xml-parser"
import type { IncomingMessageParsedXml } from "../types/IncomingMessage"
import { incomingMessageParsedXmlSchema } from "../types/IncomingMessage"

export default (message: string): IncomingMessageParsedXml => {
  const options = {
    ignoreAttributes: false,
    removeNSPrefix: true
  }

  const parser = new XMLParser(options)
  const rawParsedObj = parser.parse(message) as unknown
  return incomingMessageParsedXmlSchema.parse(rawParsedObj)
}
