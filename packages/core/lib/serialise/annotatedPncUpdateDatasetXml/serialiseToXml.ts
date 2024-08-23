import generateXml from "../../../lib/serialise/generateXml"
import type AnnotatedPncUpdateDatasetXml from "../../../types/AnnotatedPncUpdateDatasetXml"
import type { PncUpdateDataset } from "../../../types/PncUpdateDataset"
import type { PncUpdateDatasetXml } from "../../../types/PncUpdateDatasetXml"
import { mapToPncUpdateDatasetXml } from "../pnc-update-dataset-xml/serialiseToXml"

const xmlnsTags = {
  "@_xmlns": "http://www.example.org/NewXMLSchema",
  "@_xmlns:ds": "http://schemas.cjse.gov.uk/datastandards/2006-10",
  "@_xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance"
}

const normaliseNamespaces = (xmlPncUpdateDataset: PncUpdateDatasetXml) => {
  delete xmlPncUpdateDataset.PNCUpdateDataset["@_xmlns"]
  delete xmlPncUpdateDataset.PNCUpdateDataset["@_xmlns:ds"]
  delete xmlPncUpdateDataset.PNCUpdateDataset["@_xmlns:xsi"]
}

const serialiseToXml = (pncUpdateDataset: PncUpdateDataset, addFalseHasErrorAttributes = true): string => {
  const xmlPncUpdateDataset = mapToPncUpdateDatasetXml(pncUpdateDataset, addFalseHasErrorAttributes)
  normaliseNamespaces(xmlPncUpdateDataset)
  const xmlAnnotatedPncUpdateDataset: AnnotatedPncUpdateDatasetXml = {
    "?xml": xmlPncUpdateDataset["?xml"],
    AnnotatedPNCUpdateDataset: {
      PNCUpdateDataset: xmlPncUpdateDataset.PNCUpdateDataset,
      ...xmlnsTags
    }
  }

  return generateXml(xmlAnnotatedPncUpdateDataset)
}

export default serialiseToXml
