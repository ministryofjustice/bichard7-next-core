import type { XML } from "@moj-bichard7/common/types/Xml"
import type { PncUpdateDatasetParsedXml } from "./PncUpdateDatasetParsedXml"

export default interface AnnotatedPncUpdateDatasetParsedXml {
  "?xml"?: XML
  AnnotatedPNCUpdateDataset: PncUpdateDatasetParsedXml
}
