import { excludedTriggerConfig } from "bichard7-next-data-latest"
import { TriggerCode } from "../../types/TriggerCode"
import type { Trigger } from "../types/Trigger"
import type { TriggerGenerator } from "../types/TriggerGenerator"

const forceReceivesTrigger27 = (code: string): boolean =>
  !excludedTriggerConfig[code] || !excludedTriggerConfig[code].includes(TriggerCode.TRPR0027)

const generator: TriggerGenerator = (annotatedHearingOutcome, options): Trigger[] => {
  const triggersExcluded = options?.triggersExcluded

  const forceCode = annotatedHearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Case.ForceOwner?.SecondLevelCode
  const courtCode =
    annotatedHearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Hearing.CourtHearingLocation.SecondLevelCode

  if (!forceCode) {
    return []
  }

  if (forceReceivesTrigger27(forceCode) && triggersExcluded && forceCode !== courtCode) {
    return [{ code: TriggerCode.TRPR0027 }]
  }
  return []
}

export default generator
