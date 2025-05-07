import type { AnnotatedHearingOutcome } from "../../types/AnnotatedHearingOutcome"
import type { PncUpdateDataset } from "../../types/PncUpdateDataset"

export type ParseIncomingMessageResult = HearingOutcomeResult | PncUpdateDatasetResult | SPIResultsResult

type HearingOutcomeResult = {
  message: AnnotatedHearingOutcome
  type: "AnnotatedHearingOutcome"
}

type PncUpdateDatasetResult = {
  message: PncUpdateDataset
  type: "PncUpdateDataset"
}

type SPIResultsResult = {
  message: AnnotatedHearingOutcome
  type: "SPIResults"
}
