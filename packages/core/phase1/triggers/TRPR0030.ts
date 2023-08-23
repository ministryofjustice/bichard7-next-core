import type { AnnotatedHearingOutcome, Offence } from "types/AnnotatedHearingOutcome"
import { TriggerCode } from "types/TriggerCode"
import isCaseRecordable from "phase1/lib/isCaseRecordable"
import getOffenceFullCode from "phase1/lib/offence/getOffenceFullCode"
import type { TriggerGenerator } from "phase1/types/TriggerGenerator"

const triggerCode = TriggerCode.TRPR0030
const offenceCodes = ["PL84504", "PL84505", "PL84506"]

const isMatchingOffence = (offence: Offence) => {
  const fullCode = getOffenceFullCode(offence)
  return fullCode && offenceCodes.includes(fullCode)
}

const generator: TriggerGenerator = (hearingOutcome: AnnotatedHearingOutcome) => {
  const recordable = isCaseRecordable(hearingOutcome)
  if (
    !recordable &&
    hearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence.some(isMatchingOffence)
  ) {
    return [{ code: triggerCode }]
  }
  return []
}

export default generator
