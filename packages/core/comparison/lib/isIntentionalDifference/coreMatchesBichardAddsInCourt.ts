import type { CourtResultMatchingSummary } from "../../types/MatchingComparisonOutput"
import type { ComparisonData } from "../../types/ComparisonData"

const coreMatchesBichardAddsInCourt = ({ expected, actual, incomingMessage }: ComparisonData): boolean => {
  const expectedMatchingSummary = expected.courtResultMatchingSummary as CourtResultMatchingSummary
  const actualMatchingSummary = actual.courtResultMatchingSummary as CourtResultMatchingSummary

  if ("exceptions" in actualMatchingSummary || "exceptions" in expectedMatchingSummary) {
    return false
  }

  const hasManualCCRs = incomingMessage.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence.some(
    (hoOffence) => hoOffence.ManualCourtCaseReference && hoOffence.CourtCaseReferenceNumber
  )

  if (hasManualCCRs) {
    return false
  }

  const addedOffences = expectedMatchingSummary.offences.filter((offence) => offence.addedByCourt)
  const bichardAddsInCourt = addedOffences.length > 0

  const matchedOffences = expectedMatchingSummary.offences.filter((offence) => !offence.addedByCourt)
  const matchedCCRs = matchedOffences.reduce((acc: Set<string>, o) => {
    const ccr = o.courtCaseReference ?? expectedMatchingSummary.caseReference
    if (ccr) {
      acc.add(ccr)
    }

    return acc
  }, new Set<string>())

  const identicalMatchedOffences = matchedOffences.every((expectedOffence) => {
    const matchingOffenceFromActual = actualMatchingSummary.offences.find(
      (actualOffence) => expectedOffence.hoSequenceNumber === actualOffence.hoSequenceNumber
    )
    const expectedOffenceCcr = expectedOffence.courtCaseReference ?? expectedMatchingSummary.caseReference
    const actualOffenceCcr = matchingOffenceFromActual?.courtCaseReference ?? actualMatchingSummary.caseReference
    return (
      expectedOffenceCcr === actualOffenceCcr &&
      expectedOffence.pncSequenceNumber === matchingOffenceFromActual?.pncSequenceNumber
    )
  })

  const bichardAddedInCourtWereMatchedByCore = addedOffences.filter((expectedOffence) => {
    const matchingOffenceFromActual = actualMatchingSummary.offences.find(
      (actualOffence) => expectedOffence.hoSequenceNumber === actualOffence.hoSequenceNumber
    )
    return matchingOffenceFromActual?.addedByCourt !== true
  })

  const coreMatchedToOtherCcrs = bichardAddedInCourtWereMatchedByCore.some((expectedOffence) => {
    const matchingOffenceFromActual = actualMatchingSummary.offences.find(
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
