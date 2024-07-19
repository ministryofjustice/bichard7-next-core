import TriggerCode from "bichard7-next-data-latest/dist/types/TriggerCode"
import type { AnnotatedHearingOutcome, Offence } from "../../types/AnnotatedHearingOutcome"
import type { TriggerGenerator } from "../../types/TriggerGenerator"
import getOffenceFullCode from "../getOffenceFullCode"
import isCaseRecordable from "../isCaseRecordable"

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
