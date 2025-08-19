import { XMLParser } from "fast-xml-parser"

import type AnnotatedPncUpdateDataset from "../../../types/AnnotatedPncUpdateDataset"
import type AnnotatedPncUpdateDatasetParsedXml from "../../../types/AnnotatedPncUpdateDatasetParsedXml"
import type { Result } from "../../../types/Result"

import { isError } from "../../../types/Result"
import { decodeAttributeEntitiesProcessor, decodeTagEntitiesProcessor } from "../../parseAhoXml/encoding"
import { extractExceptionsFromXml } from "../../parseAhoXml/index"
import { mapXmlToPncUpdateDataSet } from "../parsePncUpdateDataSetXml/parsePncUpdateDataSetXml"

//TODO: Validate this against a real file
const mapXmlToAnnotatedPncUpdateDataset = (
  annotatedPNCUpdateDataset: AnnotatedPncUpdateDatasetParsedXml
): Result<AnnotatedPncUpdateDataset> => {
  if (!annotatedPNCUpdateDataset.AnnotatedPNCUpdateDataset) {
    return Error("Could not parse annotated PNC update dataset XML")
  }

  const pncUpdateDataset = mapXmlToPncUpdateDataSet(annotatedPNCUpdateDataset.AnnotatedPNCUpdateDataset)
  if (isError(pncUpdateDataset)) {
    return pncUpdateDataset
  }

  return {
    AnnotatedPNCUpdateDataset: {
      PNCUpdateDataset: pncUpdateDataset
    }
  }
}

export default (xml: string): AnnotatedPncUpdateDataset | Error => {
  const options = {
    alwaysCreateTextNode: true,
    attributeValueProcessor: decodeAttributeEntitiesProcessor,
    ignoreAttributes: false,
    parseAttributeValue: false,
    parseTagValue: false,
    processEntities: false,
    tagValueProcessor: decodeTagEntitiesProcessor,
    trimValues: false
  }

  const parser = new XMLParser(options)
  const rawParsedObj = parser.parse(xml)
  const annotatedPncUpdateDataset = mapXmlToAnnotatedPncUpdateDataset(rawParsedObj)
  if (isError(annotatedPncUpdateDataset)) {
    return annotatedPncUpdateDataset
  }

  annotatedPncUpdateDataset.AnnotatedPNCUpdateDataset.PNCUpdateDataset.Exceptions = extractExceptionsFromXml(xml).map(
    (e) => ({
      ...e,
      path: e.path.slice(2)
    })
  )

  return annotatedPncUpdateDataset
}
