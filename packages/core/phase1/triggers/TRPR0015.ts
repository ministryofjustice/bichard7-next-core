import type { Offence } from "../../types/AnnotatedHearingOutcome"
import { TriggerCode } from "../../types/TriggerCode"
import isCaseRecordable from "../lib/isCaseRecordable"
import type { Trigger } from "../types/Trigger"
import type { TriggerGenerator } from "../types/TriggerGenerator"

const triggerCode = TriggerCode.TRPR0015
const resultCode = 4592

const hasMatchingResultCode = (offence: Offence): boolean =>
  offence.Result.some((code) => code.CJSresultCode === resultCode)

const generator: TriggerGenerator = (hearingOutcome, options = {}) => {
  const triggers = options?.triggers
  const recordable = isCaseRecordable(hearingOutcome)
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
