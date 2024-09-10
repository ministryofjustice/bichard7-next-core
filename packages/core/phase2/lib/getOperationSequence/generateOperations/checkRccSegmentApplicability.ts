import type { AnnotatedHearingOutcome } from "../../../../types/AnnotatedHearingOutcome"
import isRecordableOffence from "../../isRecordableOffence"
import disarrCompatibleResultClass from "./disarrCompatibleResultClass"

const checkRccSegmentApplicability = (aho: AnnotatedHearingOutcome, courtCaseReferenceNumber?: string): boolean => {
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
    const thisOffenceRequiresRcc = !caseRequiresRcc && offence.Result.some((result) => result.PNCDisposalType === 2060)

    if (thisOffenceRequiresRcc && (!thisOffenceAddedByTheCourt || thisOffenceHasReportableResults)) {
      caseRequiresRcc = true
    }

    if (thisOffenceAddedByTheCourt && thisOffenceHasReportableResults) {
      caseHasReportableOffencesAddedByCourt = true
    }

    if (caseRequiresRcc && caseHasReportableOffencesAddedByCourt) {
      break
    }
  }

  return caseRequiresRcc
}

export default checkRccSegmentApplicability
