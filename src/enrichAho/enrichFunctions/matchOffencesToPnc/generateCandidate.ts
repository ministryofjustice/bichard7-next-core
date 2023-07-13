import getOffenceCode from "../../../lib/offence/getOffenceCode"
import type { Offence } from "../../../types/AnnotatedHearingOutcome"
import type { PncOffence } from "../../../types/PncQueryResult"
import type { Candidate } from "./OffenceMatcher"
import type { PncOffenceWithCaseRef } from "./matchOffencesToPnc"
import offenceIsBreach from "./offenceIsBreach"

export const normaliseCCR = (ccr: string): string => {
  const splitCCR = ccr.split("/")
  if (splitCCR.length !== 3) {
    return ccr
  }
  splitCCR[2] = splitCCR[2].replace(/^0+/, "")
  return splitCCR.map((el) => el.toUpperCase()).join("/")
}

const offenceManuallyMatches = (hoOffence: Offence, pncOffence: PncOffenceWithCaseRef): boolean => {
  const manualSequence = !!hoOffence.ManualSequenceNumber
  const manualCourtCase = !!hoOffence.ManualCourtCaseReference
  const offenceReasonSequence = hoOffence.CriminalProsecutionReference.OffenceReasonSequence
  const sequence = Number(offenceReasonSequence)
  const courtCase = hoOffence.CourtCaseReferenceNumber
  if (manualSequence && isNaN(sequence)) {
    return false
  }
  const sequenceMatches = sequence === pncOffence.pncOffence.offence.sequenceNumber
  const ccrMatches = !!courtCase && normaliseCCR(courtCase) === normaliseCCR(pncOffence.caseReference)

  if (manualSequence && manualCourtCase) {
    return sequenceMatches && ccrMatches
  } else if (manualSequence) {
    return sequenceMatches
  } else if (manualCourtCase) {
    return ccrMatches
  }

  return false
}

const convictionDatesMatch = (hoOffence: Offence, pncOffence: PncOffence): boolean => {
  const matchingConvictionDates =
    !!pncOffence.adjudication?.sentenceDate &&
    !!hoOffence.ConvictionDate &&
    hoOffence.ConvictionDate?.getTime() === pncOffence.adjudication?.sentenceDate.getTime()
  return matchingConvictionDates
}

const datesMatchExactly = (hoOffence: Offence, pncOffence: PncOffence): boolean => {
  if (hoOffence.ActualOffenceStartDate.StartDate.toISOString() !== pncOffence.offence.startDate.toISOString()) {
    return false
  }

  if (hoOffence.ActualOffenceEndDate?.EndDate === undefined && pncOffence.offence.endDate === undefined) {
    return true
  }

  if (hoOffence.ActualOffenceEndDate?.EndDate && pncOffence.offence.endDate) {
    return hoOffence.ActualOffenceEndDate.EndDate.toISOString() === pncOffence.offence.endDate.toISOString()
  }

  return false
}

const startDatesMatch = (hoOffence: Offence, pncOffence: PncOffence): boolean => {
  const hoStartDate = hoOffence.ActualOffenceStartDate.StartDate
  const pncStartDate = pncOffence.offence.startDate
  return hoStartDate.getTime() === pncStartDate.getTime()
}

const datesMatchApproximately = (hoOffence: Offence, pncOffence: PncOffence): boolean => {
  const hoStartDate = hoOffence.ActualOffenceStartDate.StartDate
  const pncStartDate = pncOffence.offence.startDate
  const startDatesAreEqual = hoStartDate.getTime() === pncStartDate.getTime()

  const hoEndDate = hoOffence.ActualOffenceEndDate?.EndDate
  const pncEndDate = pncOffence.offence.endDate
  const endDatesAreEqual = hoEndDate?.getTime() === pncEndDate?.getTime()

  if (startDatesAreEqual && endDatesAreEqual) {
    return true
  }

  if (
    hoEndDate &&
    hoStartDate.toISOString() === hoEndDate.toISOString() &&
    hoStartDate.toISOString() === pncStartDate.toISOString()
  ) {
    return true
  }

  if (!hoEndDate && !pncEndDate) {
    return hoStartDate.getTime() === pncStartDate.getTime()
  }

  if (!pncEndDate) {
    const hoStartAndEndDatesAreEqual = hoStartDate.getTime() === hoEndDate?.getTime()
    return startDatesAreEqual && hoStartAndEndDatesAreEqual
  }

  if (!hoEndDate) {
    const hoDateCode = hoOffence.ActualOffenceDateCode
    if (["1", "5"].includes(hoDateCode)) {
      return hoStartDate >= pncStartDate && hoStartDate <= pncEndDate
    }
  }

  return hoStartDate >= pncStartDate && !!hoEndDate && hoEndDate <= pncEndDate
}

const hasManualSequenceMatch = (hoOffence: Offence): boolean =>
  !!hoOffence.ManualSequenceNumber && !!hoOffence.CriminalProsecutionReference.OffenceReasonSequence

const hasManualCcrMatch = (hoOffence: Offence): boolean =>
  !!hoOffence.ManualCourtCaseReference && !!hoOffence.CourtCaseReferenceNumber

const hasManualMatch = (hoOffence: Offence): boolean =>
  hasManualSequenceMatch(hoOffence) || hasManualCcrMatch(hoOffence)

const generateCandidate = (
  hoOffence: Offence,
  pncOffence: PncOffenceWithCaseRef,
  hearingDate: Date
): void | Candidate => {
  const ignoreDates = offenceIsBreach(hoOffence)
  const hoOffenceCode = getOffenceCode(hoOffence)
  const pncOffenceCode = pncOffence.pncOffence.offence.cjsOffenceCode

  if (hoOffenceCode !== pncOffenceCode) {
    return
  }
  const candidate: Candidate = {
    adjudicationMatch: false,
    convictionDateMatch: convictionDatesMatch(hoOffence, pncOffence.pncOffence),
    exactDateMatch: false,
    fuzzyDateMatch: true,
    hoOffence,
    manualCcrMatch: false,
    manualSequenceMatch: false,
    pncOffence,
    startDateMatch: false
  }

  if (hasManualMatch(hoOffence)) {
    if (offenceManuallyMatches(hoOffence, pncOffence)) {
      candidate.manualSequenceMatch = hasManualSequenceMatch(hoOffence)
      candidate.manualCcrMatch = hasManualSequenceMatch(hoOffence)
    } else {
      return
    }
  }

  if (hoOffence.ConvictionDate && pncOffence.pncOffence.adjudication) {
    candidate.adjudicationMatch = hoOffence.ConvictionDate < hearingDate
  } else if (
    (!hoOffence.ConvictionDate || hoOffence.ConvictionDate.getTime() === hearingDate.getTime()) &&
    !pncOffence.pncOffence.adjudication
  ) {
    candidate.adjudicationMatch = true
  }

  if (ignoreDates) {
    return candidate
  }

  if (!datesMatchApproximately(hoOffence, pncOffence.pncOffence)) {
    return
  }

  if (startDatesMatch(hoOffence, pncOffence.pncOffence)) {
    candidate.startDateMatch = true
  }

  candidate.exactDateMatch = datesMatchExactly(hoOffence, pncOffence.pncOffence)

  return candidate
}

export default generateCandidate
