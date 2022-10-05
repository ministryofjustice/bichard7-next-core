import { XMLParser } from "fast-xml-parser"
import type { AnnotatedPNCUpdateDatasetXml } from "src/types/AnnotatedPNCUpdateDatasetXml"
import { decodeEntitiesProcessor } from "../../lib/encoding"
import type { AnnotatedPNCUpdateDataset } from "../../types/AnnotatedPNCUpdateDataset"
import { mapXmlHearingToAho, mapXmlCaseToAho } from "../parseAhoXml/parseAhoXml"

const mapXmlToAnnotatedPNCUpdateDataset = (
  annotatedPNCUpdateDataset: AnnotatedPNCUpdateDatasetXml
): AnnotatedPNCUpdateDataset | undefined => {
  if (annotatedPNCUpdateDataset.AnnotatedPNCUpdateDataset?.PNCUpdateDataset["br7:AnnotatedHearingOutcome"]) {
    const aho = annotatedPNCUpdateDataset.AnnotatedPNCUpdateDataset?.PNCUpdateDataset["br7:AnnotatedHearingOutcome"]
    return {
      AnnotatedPNCUpdateDataset: {
        PNCUpdateDataset: {
          AnnotatedHearingOutcome: {
            HearingOutcome: {
              Hearing: mapXmlHearingToAho(aho["br7:HearingOutcome"]["br7:Hearing"]),
              Case: mapXmlCaseToAho(aho["br7:HearingOutcome"]["br7:Case"])
            }
          }
        }
      }
    }
  }
}

export default (xml: string): AnnotatedPNCUpdateDataset | Error => {
  const options = {
    ignoreAttributes: false,
    parseTagValue: false,
    parseAttributeValue: false,
    processEntities: false,
    trimValues: false,
    alwaysCreateTextNode: true,
    attributeValueProcessor: decodeEntitiesProcessor,
    tagValueProcessor: decodeEntitiesProcessor
  }

  const parser = new XMLParser(options)
  const rawParsedObj = parser.parse(xml)
  const annotatedPNCUpdateDataset = mapXmlToAnnotatedPNCUpdateDataset(rawParsedObj)
  if (annotatedPNCUpdateDataset) {
    return annotatedPNCUpdateDataset
  }
  return new Error("Could not parse AnnotatedPNCUpdateDataset XML")
}
