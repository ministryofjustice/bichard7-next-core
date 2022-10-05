import type { Br7AnnotatedHearingOutcome } from "./AhoXml"
import type { XML } from "./xml"

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
