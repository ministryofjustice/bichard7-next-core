import type { AnnotatedHearingOutcome } from "../../types/AnnotatedHearingOutcome"
import type { CourtResultMatchingSummary } from "./MatchingComparisonOutput"
import type { PncUpdateDataset } from "../../types/PncUpdateDataset"
import type Phase from "../../types/Phase"

export type ComparisonOutput = {
  aho: AnnotatedHearingOutcome
  courtResultMatchingSummary: CourtResultMatchingSummary | null
}

export type BichardComparisonOutput = ComparisonOutput
export type CoreComparisonOutput = ComparisonOutput

export type ComparisonData = {
  expected: BichardComparisonOutput
  actual: CoreComparisonOutput
  incomingMessage: AnnotatedHearingOutcome | PncUpdateDataset
  phase: Phase
}
