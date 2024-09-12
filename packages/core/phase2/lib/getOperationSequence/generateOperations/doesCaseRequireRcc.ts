import type { AnnotatedHearingOutcome } from "../../../../types/AnnotatedHearingOutcome"
import isRecordableOffence from "../../isRecordableOffence"
import disarrCompatibleResultClass from "./disarrCompatibleResultClass"

const doesCaseRequireRcc = (aho: AnnotatedHearingOutcome, courtCaseReferenceNumber?: string) => {
  const offences = aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence.filter(
    (offence) =>
      isRecordableOffence(offence) &&
      (!courtCaseReferenceNumber || offence.CourtCaseReferenceNumber === courtCaseReferenceNumber)
  )

  return offences.some((offence) => {
    const hasPncDisposalType2060 = offence.Result.some((result) => result.PNCDisposalType === 2060)
    const isDisarrCompatible = disarrCompatibleResultClass(offence)

    return hasPncDisposalType2060 && (!offence.AddedByTheCourt || isDisarrCompatible)
  })
}

export default doesCaseRequireRcc
