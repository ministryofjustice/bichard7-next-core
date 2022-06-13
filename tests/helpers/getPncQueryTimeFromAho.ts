import { XMLParser } from "fast-xml-parser"
import type { RawAho } from "src/types/RawAho"

const getPncQueryTimeFromAho = (ahoXml: string): Date => {
  const parser = new XMLParser({
    ignoreAttributes: false
  })
  const rawParsedObj = parser.parse(ahoXml) as RawAho
  const queryTime = rawParsedObj["br7:AnnotatedHearingOutcome"]?.["br7:PNCQueryDate"]
  if (!queryTime) {
    return new Date()
  }
  return new Date(queryTime)
}

export default getPncQueryTimeFromAho
