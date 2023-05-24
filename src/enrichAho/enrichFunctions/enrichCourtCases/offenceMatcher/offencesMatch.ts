import getOffenceCode from "../../../../lib/offence/getOffenceCode"
import type { Offence } from "../../../../types/AnnotatedHearingOutcome"
import type { PncOffence } from "../../../../types/PncQueryResult"
import datesMatchApproximately from "./datesMatchApproximately"
import offenceIsBreach from "./offenceIsBreach"

export type OffenceMatchOptions = {
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

  return false
}

const offencesMatch = (hoOffence: Offence, pncOffence: PncOffence, options: OffenceMatchOptions = {}): boolean => {
  const { exactDateMatch } = { exactDateMatch: false, ...options }
  const ignoreDates = offenceIsBreach(hoOffence)
  const hoOffenceCode = getOffenceCode(hoOffence)
  const pncOffenceCode = pncOffence.offence.cjsOffenceCode

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
