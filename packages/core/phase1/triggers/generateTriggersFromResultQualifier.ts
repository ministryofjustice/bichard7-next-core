import type { AnnotatedHearingOutcome } from "types/AnnotatedHearingOutcome"
import type { Trigger } from "phase1/types/Trigger"
import type TriggerConfig from "phase1/types/TriggerConfig"

export default (
  hearingOutcome: AnnotatedHearingOutcome,
  { triggerCode, resultCodeQualifier }: TriggerConfig
): Trigger[] => {
  if (
    hearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence.some((offence) =>
      offence.Result.some(
        (r) => resultCodeQualifier && r.ResultQualifierVariable.some((qual) => qual.Code === resultCodeQualifier)
      )
    )
  ) {
    return [{ code: triggerCode }]
  }

  return []
}
