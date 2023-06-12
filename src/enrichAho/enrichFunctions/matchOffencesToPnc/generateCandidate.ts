import getOffenceCode from "../../../lib/offence/getOffenceCode"
import type { Offence } from "../../../types/AnnotatedHearingOutcome"
import type { PncOffence } from "../../../types/PncQueryResult"
import offenceIsBreach from "../enrichCourtCases/offenceMatcher/offenceIsBreach"
import type { Candidate } from "./OffenceMatcher"
import type { PncOffenceWithCaseRef } from "./matchOffencesToPnc"

export type OffenceMatchOptions = {
  exactDateMatch?: boolean
  checkConvictionDate?: boolean
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

const generateCandidate = (hoOffence: Offence, pncOffence: PncOffenceWithCaseRef): void | Candidate => {
  const ignoreDates = offenceIsBreach(hoOffence)
  const hoOffenceCode = getOffenceCode(hoOffence)
  const pncOffenceCode = pncOffence.pncOffence.offence.cjsOffenceCode

  if (hoOffenceCode !== pncOffenceCode) {
    return
  }

  const candidate: Candidate = { pncOffence, hoOffence, exact: false, convictionDatesMatch: false }

  if (ignoreDates) {
    return candidate
  }

  if (!datesMatchApproximately(hoOffence, pncOffence.pncOffence)) {
    return
  }

  if (convictionDatesMatch(hoOffence, pncOffence.pncOffence)) {
    candidate.convictionDatesMatch = true
  }

  if (datesMatchExactly(hoOffence, pncOffence.pncOffence)) {
    candidate.exact = true
  }
  return candidate
}

export default generateCandidate
