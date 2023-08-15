import type { AnnotatedPNCUpdateDatasetXml } from "core/phase1/src/types/AnnotatedPNCUpdateDatasetXml"
import { XMLParser } from "fast-xml-parser"
import { decodeAttributeEntitiesProcessor, decodeTagEntitiesProcessor } from "../../lib/encoding"
import type { AnnotatedPNCUpdateDataset } from "../../types/AnnotatedPNCUpdateDataset"
import { mapXmlCaseToAho, mapXmlHearingToAho } from "../parseAhoXml/parseAhoXml"

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
          },
          Exceptions: []
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
    attributeValueProcessor: decodeAttributeEntitiesProcessor,
    tagValueProcessor: decodeTagEntitiesProcessor
  }

  const parser = new XMLParser(options)
  const rawParsedObj = parser.parse(xml)
  const annotatedPNCUpdateDataset = mapXmlToAnnotatedPNCUpdateDataset(rawParsedObj)
  if (annotatedPNCUpdateDataset) {
    return annotatedPNCUpdateDataset
  }
  return new Error("Could not parse AnnotatedPNCUpdateDataset XML")
}
