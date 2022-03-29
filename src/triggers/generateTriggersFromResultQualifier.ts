import type { AnnotatedHearingOutcome } from "src/types/AnnotatedHearingOutcome"
import type { Trigger } from "src/types/Trigger"
import type TriggerConfig from "src/types/TriggerConfig"

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
