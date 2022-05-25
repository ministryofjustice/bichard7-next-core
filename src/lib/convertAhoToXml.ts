import { XMLBuilder } from "fast-xml-parser"
import type { AnnotatedHearingOutcome } from "src/types/AnnotatedHearingOutcome"

const convertAhoToXml = (hearingOutcome: AnnotatedHearingOutcome): string => {
  const options = {
    ignoreAttributes: false
  }

  const builder = new XMLBuilder(options)
  const xml = builder.build(hearingOutcome)

  return xml
}

export default convertAhoToXml
