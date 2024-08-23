import type { XML } from "@moj-bichard7/common/types/Xml"
import type { PncUpdateDatasetXml } from "./PncUpdateDatasetXml"

export default interface AnnotatedPncUpdateDatasetXml {
  "?xml"?: XML
  AnnotatedPNCUpdateDataset: PncUpdateDatasetXml
}
