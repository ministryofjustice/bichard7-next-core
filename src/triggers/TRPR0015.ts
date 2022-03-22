import type { Offence } from "../types/AnnotatedHearingOutcome"
import type { Trigger } from "../types/Trigger"
import { TriggerCode } from "../types/TriggerCode"
import type { TriggerGenerator } from "../types/TriggerGenerator"

const triggerCode = TriggerCode.TRPR0015
const resultCode = 4592

const hasMatchingResultCode = (offence: Offence): boolean =>
  offence.Result.some((code) => code.CJSresultCode === resultCode)

const generator: TriggerGenerator = (hearingOutcome, options = {}) => {
  const triggers = options?.triggers
  const recordable = !!hearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Case.RecordableOnPNCindicator
  return hearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence.reduce(
    (acc: Trigger[], offence: Offence) => {
      if (hasMatchingResultCode(offence) && (recordable || (triggers && triggers?.length > 0))) {
        acc.push({ code: triggerCode })
      }
      return acc
    },
    []
  )
}

export default generator
