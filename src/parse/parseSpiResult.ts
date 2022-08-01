import { XMLParser } from "fast-xml-parser"
import { decodeEntitiesProcessor } from "../lib/encoding"
import type { IncomingMessageParsedXml } from "../types/SpiResult"
import { incomingMessageParsedXmlSchema } from "../types/SpiResult"

export default (message: string): IncomingMessageParsedXml => {
  const options = {
    ignoreAttributes: false,
    removeNSPrefix: true,
    parseTagValue: false,
    trimValues: false,
    processEntities: false,
    attributeValueProcessor: decodeEntitiesProcessor,
    tagValueProcessor: decodeEntitiesProcessor
  }

  const parser = new XMLParser(options)
  const rawParsedObj = parser.parse(message) as unknown
  return incomingMessageParsedXmlSchema.parse(rawParsedObj)
}
