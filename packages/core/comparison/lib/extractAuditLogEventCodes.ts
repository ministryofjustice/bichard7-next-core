import { XMLParser } from "fast-xml-parser"
import { decodeAttributeEntitiesProcessor, decodeTagEntitiesProcessor } from "../../lib/encoding"

type NameValuePair = {
  name: {
    "#text": string
  }
  value: {
    "#text": string
  }
}

type AuditLogEventXml = {
  logEvent?: {
    nameValuePairs?: {
      nameValuePair?: NameValuePair[]
    }
  }
}

const options = {
  ignoreAttributes: false,
  parseTagValue: false,
  parseAttributeValue: false,
  processEntities: false,
  trimValues: false,
  alwaysCreateTextNode: true,
  attributeValueProcessor: decodeAttributeEntitiesProcessor,
  tagValueProcessor: decodeTagEntitiesProcessor
}

const extractAuditLogEventCodes = (auditLogEventXmls: string[]): string[] => {
  const parser = new XMLParser(options)
  return auditLogEventXmls
    .map((e) => parser.parse(e) as AuditLogEventXml)
    .map((e) => e.logEvent?.nameValuePairs?.nameValuePair?.find((p) => p.name["#text"] === "eventCode")?.value["#text"])
    .filter((e) => !!e) as string[]
}

export default extractAuditLogEventCodes
