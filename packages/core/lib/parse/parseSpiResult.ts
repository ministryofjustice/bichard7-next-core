import { XMLParser } from "fast-xml-parser"

import type { IncomingMessageParsedXml } from "../../types/SpiResult"

import { incomingMessageParsedXmlSchema } from "../../types/SpiResult"
import { decodeAttributeEntitiesProcessor, decodeTagEntitiesProcessor } from "../encoding"

export default (message: string): IncomingMessageParsedXml => {
  const options = {
    attributeValueProcessor: decodeAttributeEntitiesProcessor,
    ignoreAttributes: false,
    parseTagValue: false,
    processEntities: false,
    removeNSPrefix: true,
    tagValueProcessor: decodeTagEntitiesProcessor,
    trimValues: false
  }

  const parser = new XMLParser(options)
  const rawParsedObj = parser.parse(message) as unknown
  return incomingMessageParsedXmlSchema.parse(rawParsedObj)
}
