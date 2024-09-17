import type { AnnotatedHearingOutcome } from "../../../../types/AnnotatedHearingOutcome"
import isRecordableOffence from "../../isRecordableOffence"
import disarrCompatibleResultClass from "./disarrCompatibleResultClass"

const checkRccSegmentApplicability = (aho: AnnotatedHearingOutcome, courtCaseReferenceNumber?: string) => {
  let caseHasReportableOffencesAddedByCourt = false
  let caseRequiresRcc = false

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
      caseRequiresRcc = true
    }

    if (thisOffenceAddedByTheCourt && thisOffenceHasReportableResults) {
      caseHasReportableOffencesAddedByCourt = true
    }
  }

  if (!caseRequiresRcc) {
    return false
  }

  return caseHasReportableOffencesAddedByCourt ? false : true
}

export default checkRccSegmentApplicability
