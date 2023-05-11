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

  return false
}

const offencesMatch = (hoOffence: Offence, pncOffence: PncOffence, options: OffenceMatchOptions = {}): boolean => {
  const { checkSequenceNumbers, exactDateMatch } = { checkSequenceNumbers: false, exactDateMatch: false, ...options }
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

  const adjudicationMatches =
    !pncOffence.adjudication ||
    (!!pncOffence.adjudication &&
      hoOffence.Result.every(
        (result) => result.ResultHearingDate?.getTime() === pncOffence.adjudication?.sentenceDate.getTime()
      ))

  if (exactDateMatch) {
    return adjudicationMatches && datesMatchExactly(hoOffence, pncOffence)
  }

  return adjudicationMatches && datesMatchApproximately(hoOffence, pncOffence)
}

export default offencesMatch
