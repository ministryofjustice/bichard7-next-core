import type { CourtResultMatchingSummary } from "./MatchingComparisonOutput"

type PncComparisonResultDetail = {
  actual: CourtResultMatchingSummary | null
  expected: CourtResultMatchingSummary | null
  file?: string
  pass: boolean
}

export default PncComparisonResultDetail
