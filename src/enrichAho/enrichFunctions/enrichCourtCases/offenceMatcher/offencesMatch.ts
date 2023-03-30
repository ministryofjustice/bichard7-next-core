import getOffenceCode from "../../../../lib/offence/getOffenceCode"
import type { Offence } from "../../../../types/AnnotatedHearingOutcome"
import type { PncOffence } from "../../../../types/PncQueryResult"
import datesMatchApproximately from "./datesMatchApproximately"
import offenceIsBreach from "./offenceIsBreach"

const offencesMatch = (hoOffence: Offence, pncOffence: PncOffence, checkSequenceNumbers = false): boolean => {
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

  return datesMatchApproximately(hoOffence, pncOffence)
}

export default offencesMatch
