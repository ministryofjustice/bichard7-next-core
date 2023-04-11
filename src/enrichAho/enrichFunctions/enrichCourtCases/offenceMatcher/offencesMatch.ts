import getOffenceCode from "../../../../lib/offence/getOffenceCode"
import type { Offence } from "../../../../types/AnnotatedHearingOutcome"
import type { PncOffence } from "../../../../types/PncQueryResult"
import datesMatchApproximately from "./datesMatchApproximately"
import offenceIsBreach from "./offenceIsBreach"

export type OffenceMatchOptions = {
  checkSequenceNumbers?: boolean
  exactDateMatch?: boolean
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

  if (
    hoOffence.ActualOffenceEndDate?.EndDate &&
    hoOffence.ActualOffenceStartDate.StartDate.toISOString() === hoOffence.ActualOffenceEndDate.EndDate.toISOString()
  ) {
    return hoOffence.ActualOffenceStartDate.StartDate.toISOString() === pncOffence.offence.startDate.toISOString()
  }

  if (
    pncOffence.offence.endDate &&
    pncOffence.offence.startDate.toISOString() === pncOffence.offence.endDate.toISOString()
  ) {
    return hoOffence.ActualOffenceStartDate.StartDate.toISOString() === pncOffence.offence.startDate.toISOString()
  }

  return false
}

const offencesMatch = (hoOffence: Offence, pncOffence: PncOffence, options: OffenceMatchOptions = {}): boolean => {
  const { checkSequenceNumbers, exactDateMatch } = { checkSequenceNumbers: false, exactDateMatch: true, ...options }
  const ignoreDates = offenceIsBreach(hoOffence)
  const hoOffenceCode = getOffenceCode(hoOffence)
  const pncOffenceCode = pncOffence.offence.cjsOffenceCode

  if (checkSequenceNumbers && hoOffence.CourtOffenceSequenceNumber !== pncOffence.offence.sequenceNumber) {
    return false
  }

  if (hoOffenceCode !== pncOffenceCode) {
    return false
  }

  if (ignoreDates) {
    return true
  }

  if (exactDateMatch) {
    return datesMatchExactly(hoOffence, pncOffence)
  }

  return datesMatchApproximately(hoOffence, pncOffence)
}

export default offencesMatch
