import type { XML } from "@moj-bichard7/common/types/Xml"

import type { PncUpdateDatasetParsedXml } from "../../types/PncUpdateDatasetParsedXml"

export default interface AnnotatedPncUpdateDatasetParsedXml {
  "?xml"?: XML
  AnnotatedPNCUpdateDataset: PncUpdateDatasetParsedXml
}
