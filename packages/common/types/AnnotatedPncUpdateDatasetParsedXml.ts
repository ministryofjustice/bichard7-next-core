import type { XML } from "../types/Xml"
import type { PncUpdateDatasetParsedXml } from "./PncUpdateDatasetParsedXml"

export default interface AnnotatedPncUpdateDatasetParsedXml {
  "?xml"?: XML
  AnnotatedPNCUpdateDataset: PncUpdateDatasetParsedXml
}
