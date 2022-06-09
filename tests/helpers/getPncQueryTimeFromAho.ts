import { XMLParser } from "fast-xml-parser"
import type { ParsedAHO } from "./generateMockPncQueryResultFromAho"

const getPncQueryTimeFromAho = (ahoXml: string): Date => {
  const parser = new XMLParser({
    ignoreAttributes: false,
    removeNSPrefix: true
  })
  const rawParsedObj = parser.parse(ahoXml) as ParsedAHO
  const queryTime = rawParsedObj.AnnotatedHearingOutcome.PNCQueryDate
  return new Date(queryTime)
}

export default getPncQueryTimeFromAho
