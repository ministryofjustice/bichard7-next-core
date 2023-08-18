import type { XML } from "@moj-bichard7/common/types/Xml"
import type { Br7AnnotatedHearingOutcome } from "./AhoXml"

export interface AnnotatedPNCUpdateDatasetXml {
  "?xml": XML
  AnnotatedPNCUpdateDataset?: AnnotatedPNCUpdateDataset
}

export interface AnnotatedPNCUpdateDataset {
  PNCUpdateDataset: PNCUpdateDataset
}

export interface PNCUpdateDataset {
  "br7:AnnotatedHearingOutcome": Br7AnnotatedHearingOutcome
}
