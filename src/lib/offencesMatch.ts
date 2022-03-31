import type { Offence } from "src/types/AnnotatedHearingOutcome"
import type { PncOffence } from "src/types/PncQueryResult"
import getOffenceCode from "src/utils/offence/getOffenceCode"
import offenceIsBreach from "./offenceIsBreach"

const offencesMatch = (hoOffence: Offence, pncOffence: PncOffence): boolean => {
  const ignoreDates = offenceIsBreach(hoOffence)
  const hoOffenceCode = getOffenceCode(hoOffence)
  const pncOffenceCode = pncOffence.offence.cjsOffenceCode

  if (hoOffenceCode !== pncOffenceCode) {
    return false
  }

  if (ignoreDates) {
    return true
  }

  const hoStartDate = hoOffence.ActualOffenceStartDate.StartDate
  const pncStartDate = pncOffence.offence.startDate
  const startDatesAreEqual = hoStartDate.getTime() === pncStartDate.getTime()

  const hoEndDate = hoOffence.ActualOffenceEndDate.EndDate
  const pncEndDate = pncOffence.offence.endDate
  const endDatesAreEqual = hoEndDate?.getTime() === pncEndDate?.getTime()

  if (startDatesAreEqual && endDatesAreEqual) {
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

export default offencesMatch
