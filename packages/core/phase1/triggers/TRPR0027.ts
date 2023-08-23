import { TriggerCode } from "types/TriggerCode"
import requireStandingData from "phase1/lib/requireStandingData"
import type { Trigger } from "phase1/types/Trigger"
import type { TriggerGenerator } from "phase1/types/TriggerGenerator"
const { excludedTriggerConfig } = requireStandingData()

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
