import type { AnnotatedHearingOutcome } from "../../types/AnnotatedHearingOutcome"
import type Phase from "../../types/Phase"
import type { PncUpdateDataset } from "../../types/PncUpdateDataset"
import type { CourtResultMatchingSummary } from "./MatchingComparisonOutput"

export type BichardComparisonOutput = ComparisonOutput

export type ComparisonData = {
  actual: CoreComparisonOutput
  expected: BichardComparisonOutput
  incomingMessage: AnnotatedHearingOutcome | PncUpdateDataset
  phase: Phase
}
export type ComparisonOutput = {
  aho: AnnotatedHearingOutcome
  courtResultMatchingSummary: CourtResultMatchingSummary | null
}

export type CoreComparisonOutput = ComparisonOutput
