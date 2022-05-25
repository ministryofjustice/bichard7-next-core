import { XMLParser } from "fast-xml-parser"
import type { AhoParsedXml } from "src/types/AhoParsedXml"
// import { incomingMessageParsedXmlSchema } from "src/types/IncomingMessage"

export default (xml: string): AhoParsedXml => {
  const options = {
    ignoreAttributes: false,
    removeNSPrefix: true
  }

  const parser = new XMLParser(options)
  const rawParsedObj = parser.parse(xml) as unknown
  return rawParsedObj as AhoParsedXml
  // return incomingMessageParsedXmlSchema.parse(rawParsedObj)
}
