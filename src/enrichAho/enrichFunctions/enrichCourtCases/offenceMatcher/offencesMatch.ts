import getOffenceCode from "src/lib/offence/getOffenceCode"
import type { Offence } from "src/types/AnnotatedHearingOutcome"
import type { PncOffence } from "src/types/PncQueryResult"
import datesMatchApproximately from "./datesMatchApproximately"
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

  return datesMatchApproximately(hoOffence, pncOffence)
}

export default offencesMatch
