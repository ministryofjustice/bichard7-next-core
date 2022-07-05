import getOffenceCode from "src/lib/offence/getOffenceCode"
import type { Offence } from "src/types/AnnotatedHearingOutcome"
import offenceIsBreach from "./offenceIsBreach"
import { offencesHaveEqualResults } from "./resultsAreEqual"

const getStartDate = (offence: Offence): number => offence.ActualOffenceStartDate.StartDate.getTime()
const getEndDate = (offence: Offence): number | undefined => offence.ActualOffenceEndDate?.EndDate.getTime()

const offencesAreEqual = (offence1: Offence, offence2: Offence, ignoreBreachDates = false): boolean => {
  if (getOffenceCode(offence1) !== getOffenceCode(offence2)) {
    return false
  }

  if (!(ignoreBreachDates && offenceIsBreach(offence1) && offenceIsBreach(offence2))) {
    if (getStartDate(offence1) !== getStartDate(offence2) || getEndDate(offence1) !== getEndDate(offence2)) {
      return false
    }
  }

  return offencesHaveEqualResults([offence1, offence2])
}

export default offencesAreEqual
