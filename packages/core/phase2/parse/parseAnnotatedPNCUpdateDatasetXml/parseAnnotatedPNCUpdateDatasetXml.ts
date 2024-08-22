import type { Result } from "@moj-bichard7/common/types/Result"
import { isError } from "@moj-bichard7/common/types/Result"
import { XMLParser } from "fast-xml-parser"
import { decodeAttributeEntitiesProcessor, decodeTagEntitiesProcessor } from "../../../lib/encoding"
import { extractExceptionsFromXml } from "../../../lib/parse/parseAhoXml"
import type AnnotatedPncUpdateDataset from "../../../types/AnnotatedPNCUpdateDataset"
import type AnnotatedPncUpdateDatasetParsedXml from "../../types/AnnotatedPncUpdateDatasetParsedXml"
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
  const annotatedPncUpdateDataset = mapXmlToAnnotatedPncUpdateDataset(rawParsedObj)
  if (isError(annotatedPncUpdateDataset)) {
    return annotatedPncUpdateDataset
  }

  annotatedPncUpdateDataset.AnnotatedPNCUpdateDataset.PNCUpdateDataset.Exceptions = extractExceptionsFromXml(xml).map(
    (e) => {
      e.path.shift()
      return e
    }
  )

  return annotatedPncUpdateDataset
}
