import type { CourtResultMatchingSummary } from "./MatchingComparisonOutput"

type PncComparisonResultDetail = {
  pass: boolean
  expected: CourtResultMatchingSummary | null
  actual: CourtResultMatchingSummary | null
  file?: string
}

export default PncComparisonResultDetail
