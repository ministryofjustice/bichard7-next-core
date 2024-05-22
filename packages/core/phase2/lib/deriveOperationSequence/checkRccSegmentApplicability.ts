import type { AnnotatedHearingOutcome } from "../../../types/AnnotatedHearingOutcome"
import isRecordableOffence from "../../isRecordableOffence"
import disarrCompatibleResultClass from "./disarrCompatibleResultClass"

export enum RccSegmentApplicability {
  CaseDoesNotRequireRcc = "false", // UpdateMessageUtilsImpl.java:749
  CaseRequiresRccAndHasReportableOffences = "true", // UpdateMessageUtilsImpl.java:751
  CaseRequiresRccButHasNoReportableOffences = "null" // UpdateMessageUtilsImpl.java:753
}

const checkRccSegmentApplicability = (
  aho: AnnotatedHearingOutcome,
  courtCaseReferenceNumber?: string
): RccSegmentApplicability => {
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

  if (!caseRequiresRcc) {
    return RccSegmentApplicability.CaseDoesNotRequireRcc
  }

  return caseHasReportableOffencesAddedByCourt
    ? RccSegmentApplicability.CaseRequiresRccAndHasReportableOffences
    : RccSegmentApplicability.CaseRequiresRccButHasNoReportableOffences
}

export default checkRccSegmentApplicability
