import getRecordableOffencesForCourtCase from "../../../../lib/getRecordableOffencesForCourtCase"
import type { AnnotatedHearingOutcome } from "../../../../types/AnnotatedHearingOutcome"
import isResultCompatibleWithDisposal from "../../isResultCompatibleWithDisposal"

export enum RccSegmentApplicability {
  CaseDoesNotRequireRcc,
  CaseRequiresRccAndHasReportableOffences,
  CaseRequiresRccButHasNoReportableOffences
}

const checkRccSegmentApplicability = (
  aho: AnnotatedHearingOutcome,
  courtCaseReferenceNumber?: string
): RccSegmentApplicability => {
  let caseHasReportableOffencesAddedByCourt = false
  let caseRequiresRcc = false
  const offences = getRecordableOffencesForCourtCase(aho, courtCaseReferenceNumber)

  for (const offence of offences) {
    const offenceRequiresRcc = offence.Result.some((result) => result.PNCDisposalType === 2060)
    caseRequiresRcc ||= offenceRequiresRcc && (!offence.AddedByTheCourt || isResultCompatibleWithDisposal(offence))
    caseHasReportableOffencesAddedByCourt ||= !!offence.AddedByTheCourt && isResultCompatibleWithDisposal(offence)

    if (caseRequiresRcc && caseHasReportableOffencesAddedByCourt) {
      return RccSegmentApplicability.CaseRequiresRccAndHasReportableOffences
    }
  }

  return caseRequiresRcc
    ? RccSegmentApplicability.CaseRequiresRccButHasNoReportableOffences
    : RccSegmentApplicability.CaseDoesNotRequireRcc
}

export default checkRccSegmentApplicability
