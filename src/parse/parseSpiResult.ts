import { XMLParser } from "fast-xml-parser"
import type { IncomingMessageParsedXml } from "src/types/SpiResult"
import { incomingMessageParsedXmlSchema } from "src/types/SpiResult"

export default (message: string): IncomingMessageParsedXml => {
  const options = {
    ignoreAttributes: false,
    removeNSPrefix: true,
    trimValues: false
  }

  const parser = new XMLParser(options)
  const rawParsedObj = parser.parse(message) as unknown
  return incomingMessageParsedXmlSchema.parse(rawParsedObj)
}
