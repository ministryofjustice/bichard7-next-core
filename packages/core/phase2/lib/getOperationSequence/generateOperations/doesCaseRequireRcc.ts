import type { AnnotatedHearingOutcome } from "../../../../types/AnnotatedHearingOutcome"
import isRecordableOffence from "../../isRecordableOffence"
import disarrCompatibleResultClass from "./disarrCompatibleResultClass"

const doesCaseRequireRcc = (aho: AnnotatedHearingOutcome, courtCaseReferenceNumber?: string) => {
  const offences = aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence.filter(
    (offence) =>
      isRecordableOffence(offence) &&
      (!courtCaseReferenceNumber || offence.CourtCaseReferenceNumber === courtCaseReferenceNumber)
  )

  for (const offence of offences) {
    const thisOffenceAddedByTheCourt = offence.AddedByTheCourt
    const thisOffenceHasReportableResults = !offence.AddedByTheCourt || disarrCompatibleResultClass(offence)
    const thisOffenceRequiresRcc = offence.Result.some((result) => result.PNCDisposalType === 2060)

    if (thisOffenceRequiresRcc && (!thisOffenceAddedByTheCourt || thisOffenceHasReportableResults)) {
      return true
    }

    if (thisOffenceAddedByTheCourt && thisOffenceHasReportableResults) {
      return true
    }
  }
}

export default doesCaseRequireRcc
