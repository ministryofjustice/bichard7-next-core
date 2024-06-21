import type { ComparisonData } from "../../types/ComparisonData"

// Core normalises CCRs when checking for matching CCRs on the PNC, so it can handle extra leading 0s
// and still match. Bichard does not do this, and so ignores the CCRs and does something different.

const missingEmptyCcr = ({ expected, actual }: ComparisonData): boolean => {
  if (JSON.stringify(expected.courtResultMatchingSummary) !== JSON.stringify(actual.courtResultMatchingSummary)) {
    return false
  }

  const missingCcrElement = expected.aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence.some(
    (expectedOffence, index) => {
      const actualOffence = actual.aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[index]

      return expectedOffence.CourtCaseReferenceNumber === null && actualOffence.CourtCaseReferenceNumber === undefined
    }
  )

  return missingCcrElement
}

export default missingEmptyCcr
