import type { AhoXml } from "core/phase1/types/AhoXml"
import { XMLParser } from "fast-xml-parser"

const getPncQueryTimeFromAho = (ahoXml: string): Date | undefined => {
  const parser = new XMLParser({
    ignoreAttributes: false,
    alwaysCreateTextNode: true
  })
  const rawParsedObj = parser.parse(ahoXml) as AhoXml
  const queryTime = rawParsedObj["br7:AnnotatedHearingOutcome"]?.["br7:PNCQueryDate"]
  if (!queryTime) {
    return
  }
  return new Date(queryTime["#text"])
}

export default getPncQueryTimeFromAho
