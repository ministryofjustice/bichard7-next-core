import type { AnnotatedHearingOutcome } from "src/types/AnnotatedHearingOutcome"
import xml2js = require("xml2js")

const convertAhoToXml = (hearingOutcome: AnnotatedHearingOutcome): string => {
  const builder = new xml2js.Builder()
  const xml = builder.buildObject(hearingOutcome)

  return JSON.stringify(xml)
}

export default convertAhoToXml
