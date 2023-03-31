import type { CourtResultMatchingSummary } from "./MatchingComparisonOutput"

type PncComparisonResultDetail = {
  pass: boolean
  matched: boolean
  expected: CourtResultMatchingSummary | null
  actual: CourtResultMatchingSummary | null
  file?: string
}

export default PncComparisonResultDetail
