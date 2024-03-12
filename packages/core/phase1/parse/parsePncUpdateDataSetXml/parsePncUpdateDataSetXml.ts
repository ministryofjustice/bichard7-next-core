import { XMLParser } from "fast-xml-parser"
import { decodeAttributeEntitiesProcessor, decodeTagEntitiesProcessor } from "../../lib/encoding"
import type { PncUpdateDataset } from "../../types/PncUpdateDataset"
import { mapXmlToAho } from "../parseAhoXml"
import { isError } from "@moj-bichard7/common/types/Result"

const mapXmlToPNCUpdateDataSet = (pncUpdateDataSet: PncUpdateDatasetXml): PncUpdateDataset | Error => {
  const rootElement = pncUpdateDataSet["PNCUpdateDataset"] ? pncUpdateDataSet["PNCUpdateDataset"] : pncUpdateDataSet
  if (!rootElement["br7:AnnotatedHearingOutcome"]) {
    return Error("Could not parse PNC update dataset XML")
  }

  const aho = mapXmlToAho(rootElement["br7:AnnotatedHearingOutcome"])
  if(isError(aho)) {
    return aho
  }

  return {
    AnnotatedHearingOutcome: aho,
    Operation: []
  }
}

export default (xml: string): PncUpdateDataset | Error => {
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
  return mapXmlToPNCUpdateDataSet(rawParsedObj)
}
