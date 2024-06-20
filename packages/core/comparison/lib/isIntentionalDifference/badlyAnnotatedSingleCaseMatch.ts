import type { CourtResultMatchingSummary } from "../../types/MatchingComparisonOutput"
import type { IntentionalDifference } from "../../types/IntentionalDifference"

const badlyAnnotatedSingleCaseMatch = ({ expected, actual }: IntentionalDifference): boolean => {
  const expectedMatchingSummary = expected.courtResultMatchingSummary as CourtResultMatchingSummary
  const actualMatchingSummary = actual.courtResultMatchingSummary as CourtResultMatchingSummary

  if ("exceptions" in actualMatchingSummary || "exceptions" in expectedMatchingSummary) {
    return false
  }

  const expectedCourtCaseReferences = expectedMatchingSummary.offences.reduce((acc: Set<string>, offence) => {
    if (offence.courtCaseReference) {
      acc.add(offence.courtCaseReference)
    }

    return acc
  }, new Set<string>())

  if (expectedCourtCaseReferences.size === 1) {
    return expectedMatchingSummary.offences.every((offenceInExpected) =>
      actualMatchingSummary.offences.some(
        (offenceInActual) =>
          offenceInExpected.hoSequenceNumber === offenceInActual.hoSequenceNumber &&
          offenceInExpected.pncSequenceNumber === offenceInActual.pncSequenceNumber
      )
    )
  }

  return false
}

export default badlyAnnotatedSingleCaseMatch
