import type { CourtResultMatchingSummary } from "src/comparison/types/MatchingComparisonOutput"
import type { AnnotatedHearingOutcome } from "src/types/AnnotatedHearingOutcome"

const coreMatchesBichardAddsInCourt = (
  expected: CourtResultMatchingSummary,
  actual: CourtResultMatchingSummary,
  _: AnnotatedHearingOutcome,
  __: AnnotatedHearingOutcome
): boolean => {
  if ("exceptions" in actual || "exceptions" in expected) {
    return false
  }

  const addedOffences = expected.offences.filter((offence) => offence.addedByCourt)
  const bichardAddsInCourt = addedOffences.length > 0

  const identicalMatchedOffences = expected.offences
    .filter((offence) => !offence.addedByCourt)
    .every((expectedOffence) => {
      const matchingOffenceFromActual = actual.offences.find(
        (actualOffence) => expectedOffence.hoSequenceNumber === actualOffence.hoSequenceNumber
      )
      const expectedOffenceCcr = expectedOffence.courtCaseReference ?? expected.caseReference
      const actualOffenceCcr = matchingOffenceFromActual?.courtCaseReference ?? actual.caseReference
      return (
        expectedOffenceCcr === actualOffenceCcr &&
        expectedOffence.pncSequenceNumber === matchingOffenceFromActual?.pncSequenceNumber
      )
    })

  const bichardAddedInCourtWereMatchedByCore = addedOffences.filter((expectedOffence) => {
    const matchingOffenceFromActual = actual.offences.find(
      (actualOffence) => expectedOffence.hoSequenceNumber === actualOffence.hoSequenceNumber
    )
    return matchingOffenceFromActual?.addedByCourt !== true
  })

  return bichardAddsInCourt && identicalMatchedOffences && bichardAddedInCourtWereMatchedByCore.length > 0
}

export default coreMatchesBichardAddsInCourt
