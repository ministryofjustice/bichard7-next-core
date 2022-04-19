import type { AnnotatedHearingOutcome } from "src/types/AnnotatedHearingOutcome"

const isCaseRecordable = (annotatedHearingOutcome: AnnotatedHearingOutcome): boolean => {
  const isPncQuery = annotatedHearingOutcome.PncQuery !== undefined
  const isThereARecordableOffence =
    annotatedHearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence.some(
      (offence) => offence.RecordableOnPNCindicator === "Y"
    )
  return isPncQuery || isThereARecordableOffence
}

export default isCaseRecordable
