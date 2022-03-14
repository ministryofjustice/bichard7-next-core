import type { AnnotatedHearingOutcome } from "../types/AnnotatedHearingOutcome"
import type { Trigger } from "../types/Trigger"
import type TriggerConfig from "../types/TriggerConfig"

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
