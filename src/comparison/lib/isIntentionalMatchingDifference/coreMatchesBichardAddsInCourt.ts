import type { CourtResultMatchingSummary } from "src/comparison/types/MatchingComparisonOutput"
import type { AnnotatedHearingOutcome } from "src/types/AnnotatedHearingOutcome"

const coreMatchesBichardAddsInCourt = (
  expected: CourtResultMatchingSummary,
  actual: CourtResultMatchingSummary,
  _: AnnotatedHearingOutcome,
  __: AnnotatedHearingOutcome,
  incomingAho: AnnotatedHearingOutcome
): boolean => {
  if ("exceptions" in actual || "exceptions" in expected) {
    return false
  }

  const hasManualCCRs = incomingAho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence.some(
    (hoOffence) => hoOffence.ManualCourtCaseReference && hoOffence.CourtCaseReferenceNumber
  )

  if (hasManualCCRs) {
    return false
  }

  const addedOffences = expected.offences.filter((offence) => offence.addedByCourt)
  const bichardAddsInCourt = addedOffences.length > 0

  const matchedOffences = expected.offences.filter((offence) => !offence.addedByCourt)
  const matchedCCRs = matchedOffences.reduce((acc: Set<string>, o) => {
    const ccr = o.courtCaseReference ?? expected.caseReference
    if (ccr) {
      acc.add(ccr)
    }
    return acc
  }, new Set<string>())

  const identicalMatchedOffences = matchedOffences.every((expectedOffence) => {
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

  const coreMatchedToOtherCcrs = bichardAddedInCourtWereMatchedByCore.some((expectedOffence) => {
    const matchingOffenceFromActual = actual.offences.find(
      (actualOffence) => expectedOffence.hoSequenceNumber === actualOffence.hoSequenceNumber
    )
    return !matchedCCRs.has(matchingOffenceFromActual!.courtCaseReference!)
  })

  return (
    bichardAddsInCourt &&
    identicalMatchedOffences &&
    bichardAddedInCourtWereMatchedByCore.length > 0 &&
    coreMatchedToOtherCcrs
  )
}

export default coreMatchesBichardAddsInCourt
