import type { AnnotatedHearingOutcome } from "src/types/AnnotatedHearingOutcome"
import type { Trigger } from "src/types/Trigger"
import { TriggerCode } from "src/types/TriggerCode"

const generator = {
  independent: false,
  generate: (annotatedHearingOutcome: AnnotatedHearingOutcome, triggersIgnored: boolean): Trigger[] => {
    const forceCode = annotatedHearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Case.ForceOwner?.SecondLevelCode
    const courtCode =
      annotatedHearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Hearing.CourtHearingLocation.SecondLevelCode

    if (!forceCode) {
      return []
    }

    if (triggersIgnored && forceCode !== courtCode) {
      return [{ code: TriggerCode.TRPR0027 }]
    }
    return []
  }
}

export default generator
