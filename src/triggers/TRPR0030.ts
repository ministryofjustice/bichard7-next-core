import isCaseRecordable from "src/lib/isCaseRecordable"
import type { Offence } from "src/types/AnnotatedHearingOutcome"
import { TriggerCode } from "src/types/TriggerCode"
import type { TriggerGenerator } from "src/types/TriggerGenerator"
import getOffenceFullCode from "src/utils/offence/getOffenceFullCode"

const triggerCode = TriggerCode.TRPR0030
const offenceCodes = ["PL84504", "PL84505", "PL84506"]

const isMatchingOffence = (offence: Offence) => {
  const fullCode = getOffenceFullCode(offence)
  return fullCode && offenceCodes.includes(fullCode)
}

const generator: TriggerGenerator = (hearingOutcome) => {
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
