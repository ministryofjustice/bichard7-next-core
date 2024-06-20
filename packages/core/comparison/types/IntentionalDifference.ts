import type { AnnotatedHearingOutcome } from "../../types/AnnotatedHearingOutcome"
import type { CourtResultMatchingSummary } from "./MatchingComparisonOutput"
import type { PncUpdateDataset } from "../../types/PncUpdateDataset"

export type ComparisonOutput = {
  aho: AnnotatedHearingOutcome
  courtResultMatchingSummary: CourtResultMatchingSummary | null
}

export type BichardComparisonOutput = ComparisonOutput
export type CoreComparisonOutput = ComparisonOutput

export type IntentionalDifference = {
  expected: BichardComparisonOutput
  actual: CoreComparisonOutput
  incomingMessage: AnnotatedHearingOutcome | PncUpdateDataset
}
