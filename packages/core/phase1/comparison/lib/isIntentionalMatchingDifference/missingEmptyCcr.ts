import type { AnnotatedHearingOutcome } from "types/AnnotatedHearingOutcome"
import type { CourtResultMatchingSummary } from "phase1/comparison/types/MatchingComparisonOutput"

// Core normalises CCRs when checking for matching CCRs on the PNC, so it can handle extra leading 0s
// and still match. Bichard does not do this, and so ignores the CCRs and does something different.

const missingEmptyCcr = (
  expected: CourtResultMatchingSummary | null,
  actual: CourtResultMatchingSummary | null,
  expectedAho: AnnotatedHearingOutcome,
  actualAho: AnnotatedHearingOutcome,
  ___: AnnotatedHearingOutcome
): boolean => {
  if (JSON.stringify(expected) !== JSON.stringify(actual)) {
    return false
  }

  const missingCcrElement = expectedAho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence.some(
    (expectedOffence, index) => {
      const actualOffence = actualAho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[index]
      return expectedOffence.CourtCaseReferenceNumber === null && actualOffence.CourtCaseReferenceNumber === undefined
    }
  )

  return missingCcrElement
}

export default missingEmptyCcr
