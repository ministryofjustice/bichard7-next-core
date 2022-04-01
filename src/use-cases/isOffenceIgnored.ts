import type { Offence } from "src/types/AnnotatedHearingOutcome"
import getOffenceCode from "src/utils/offence/getOffenceCode"

const ignoredOffenceCodes = ["05MC001"]

const isOffenceIgnored = (offence: Offence): boolean => {
  const reason = offence.CriminalProsecutionReference.OffenceReason
  if (reason) {
    const offenceCode = getOffenceCode(reason)
    return ignoredOffenceCodes.includes(offenceCode)
  }
  return false
}

export default isOffenceIgnored
