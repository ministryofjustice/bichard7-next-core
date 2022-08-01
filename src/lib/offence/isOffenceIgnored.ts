import getOffenceCode from "../../lib/offence/getOffenceCode"
import type { Offence } from "../../types/AnnotatedHearingOutcome"

const ignoredOffenceCodes = ["05MC001"]

const isOffenceIgnored = (offence: Offence): boolean => {
  const reason = offence.CriminalProsecutionReference.OffenceReason
  if (reason) {
    const offenceCode = getOffenceCode(offence)
    return !!offenceCode && ignoredOffenceCodes.includes(offenceCode)
  }
  return false
}

export default isOffenceIgnored
