import type { AnnotatedHearingOutcome } from "../types/AnnotatedHearingOutcome"

const isCaseRecordable = (annotatedHearingOutcome: AnnotatedHearingOutcome): boolean => {
  const isPncQuery = annotatedHearingOutcome.PncQuery !== undefined
  const isThereARecordableOffence =
    annotatedHearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence.some(
      (offence) => offence.RecordableOnPNCindicator
    )
  return isPncQuery || isThereARecordableOffence
}

export default isCaseRecordable
