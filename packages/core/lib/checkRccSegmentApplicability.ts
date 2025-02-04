import type { Offence } from "../types/AnnotatedHearingOutcome"

import isResultCompatibleWithDisposal from "./isResultCompatibleWithDisposal"
import getRecordableOffencesForCourtCase from "./offences/getRecordableOffencesForCourtCase"

export enum RccSegmentApplicability {
  CaseDoesNotRequireRcc,
  CaseRequiresRccAndHasReportableOffences,
  CaseRequiresRccButHasNoReportableOffences
}

const checkRccSegmentApplicability = (
  offences: Offence[],
  courtCaseReferenceNumber?: string
): RccSegmentApplicability => {
  let caseHasReportableOffencesAddedByCourt = false
  let caseRequiresRcc = false
  const recordableOffences = getRecordableOffencesForCourtCase(offences, courtCaseReferenceNumber)

  for (const offence of recordableOffences) {
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
