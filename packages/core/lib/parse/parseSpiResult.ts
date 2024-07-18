import { XMLParser } from "fast-xml-parser"
import type { IncomingMessageParsedXml } from "../../phase1/types/SpiResult"
import { incomingMessageParsedXmlSchema } from "../../phase1/types/SpiResult"
import { decodeAttributeEntitiesProcessor, decodeTagEntitiesProcessor } from "../encoding"

export default (message: string): IncomingMessageParsedXml => {
  const options = {
    ignoreAttributes: false,
    removeNSPrefix: true,
    parseTagValue: false,
    trimValues: false,
    processEntities: false,
    attributeValueProcessor: decodeAttributeEntitiesProcessor,
    tagValueProcessor: decodeTagEntitiesProcessor
  }

  const parser = new XMLParser(options)
  const rawParsedObj = parser.parse(message) as unknown
  return incomingMessageParsedXmlSchema.parse(rawParsedObj)
}
