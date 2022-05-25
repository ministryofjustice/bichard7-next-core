import { XMLBuilder } from "fast-xml-parser"
import type { AhoParsedXml } from "src/types/AhoParsedXml"
import type { AnnotatedHearingOutcome } from "src/types/AnnotatedHearingOutcome"
import { parseString } from "xml2js"

/* 

  Xml Aho from file -> JSON -> Types -> Easy street

*/

const parseXML = (xml: string): AnnotatedHearingOutcome => {
  let parsedResult: AnnotatedHearingOutcome | undefined
  parseString(xml, (err, result) => {
    if (err) {
      console.error(err)
      return undefined
    }

    parsedResult = result
  })

  return parsedResult as AnnotatedHearingOutcome
}

const mapAhoToXml = (aho: AnnotatedHearingOutcome): AhoParsedXml => {
  return {} as AhoParsedXml
}

const convertAhoToXml = (hearingOutcome: AnnotatedHearingOutcome): string => {
  const options = {
    ignoreAttributes: false
  }

  const builder = new XMLBuilder(options)
  const xml = builder.build(mapAhoToXml(hearingOutcome))

  return xml
}

export default convertAhoToXml
