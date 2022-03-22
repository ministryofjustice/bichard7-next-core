import type { Trigger } from "src/types/Trigger"
import { TriggerCode } from "src/types/TriggerCode"
import type { TriggerGenerator } from "src/types/TriggerGenerator"

const generator: TriggerGenerator = (annotatedHearingOutcome, options): Trigger[] => {
  const triggersExcluded = options?.triggersExcluded

  const forceCode = annotatedHearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Case.ForceOwner?.SecondLevelCode
  const courtCode =
    annotatedHearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Hearing.CourtHearingLocation.SecondLevelCode

  if (!forceCode) {
    return []
  }

  if (triggersExcluded && forceCode !== courtCode) {
    return [{ code: TriggerCode.TRPR0027 }]
  }
  return []
}

export default generator
