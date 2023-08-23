import type { CourtResultMatchingSummary } from "phase1/comparison/types/MatchingComparisonOutput"

type PncComparisonResultDetail = {
  pass: boolean
  expected: CourtResultMatchingSummary | null
  actual: CourtResultMatchingSummary | null
  file?: string
}

export default PncComparisonResultDetail
