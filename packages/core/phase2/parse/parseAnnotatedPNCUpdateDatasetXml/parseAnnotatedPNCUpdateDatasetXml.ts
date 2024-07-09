import { isError, Result } from "@moj-bichard7/common/types/Result"
import { XMLParser } from "fast-xml-parser"
import { decodeAttributeEntitiesProcessor, decodeTagEntitiesProcessor } from "../../../phase1/lib/encoding"
import type { AnnotatedPNCUpdateDataset } from "../../../types/AnnotatedPNCUpdateDataset"
import type { AnnotatedPNCUpdateDatasetXml } from "../../types/AnnotatedPNCUpdateDatasetXml"
import { mapXmlToPNCUpdateDataSet } from "../parsePncUpdateDataSetXml/parsePncUpdateDataSetXml"

//TODO: Validate this against a real file
const mapXmlToAnnotatedPNCUpdateDataset = (
  annotatedPNCUpdateDataset: AnnotatedPNCUpdateDatasetXml
): Result<AnnotatedPNCUpdateDataset> => {
  if (!annotatedPNCUpdateDataset.AnnotatedPNCUpdateDataset) {
    return Error("Could not parse annotated PNC update dataset XML")
  }

  const pncUpdateDataset = mapXmlToPNCUpdateDataSet(annotatedPNCUpdateDataset.AnnotatedPNCUpdateDataset)
  if (isError(pncUpdateDataset)) {
    return pncUpdateDataset
  }

  return {
    AnnotatedPNCUpdateDataset: {
      PNCUpdateDataset: pncUpdateDataset
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
  if (isError(annotatedPNCUpdateDataset)) {
    return annotatedPNCUpdateDataset
  }

  return annotatedPNCUpdateDataset
}
