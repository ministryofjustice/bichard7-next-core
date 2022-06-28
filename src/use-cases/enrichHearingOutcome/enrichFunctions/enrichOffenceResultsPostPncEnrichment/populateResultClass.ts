import isAdjourned from "src/lib/isAdjourned"
import isAdjournedNoNextHearing from "src/lib/isAdjournedNoNextHearing"
import isWarrantIssued from "src/lib/isWarrantIssued"
import { ResultClass, RESULT_CLASS_PLEAS, RESULT_CLASS_RESULT_CODES, RESULT_CLASS_VERDICTS } from "src/lib/properties"
import type { OrganisationUnitCodes, Result } from "src/types/AnnotatedHearingOutcome"

const populateResultClass = (result: Result, convictionDate: Date | undefined, dateOfHearing: Date) => {
  const nextHearingPresent = !!result.NextResultSourceOrganisation?.OrganisationUnitCode
  const adjourned = isAdjourned(result.CJSresultCode)
  const warrantIssued = isWarrantIssued(result.CJSresultCode)
  const adjournedNoNextHearingDetails = isAdjournedNoNextHearing(result.CJSresultCode)
  const adjournment = nextHearingPresent || adjourned || warrantIssued || adjournedNoNextHearingDetails

  if (adjourned && !nextHearingPresent) {
    result.NextResultSourceOrganisation = {} as OrganisationUnitCodes
  }

  const { Verdict, PleaStatus, CJSresultCode } = result

  let resultClass = ResultClass.UNRESULTED
  if (convictionDate && dateOfHearing && convictionDate.getTime() < dateOfHearing.getTime()) {
    resultClass = adjournment ? ResultClass.ADJOURNMENT_POST_JUDGEMENT : ResultClass.SENTENCE
  } else if (convictionDate && dateOfHearing && convictionDate.getTime() === dateOfHearing.getTime()) {
    resultClass = adjournment ? ResultClass.ADJOURNMENT_WITH_JUDGEMENT : ResultClass.JUDGEMENT_WITH_FINAL_RESULT
  } else if (RESULT_CLASS_PLEAS.includes(PleaStatus?.toString() ?? "") && !adjournment) {
    resultClass = ResultClass.JUDGEMENT_WITH_FINAL_RESULT
  } else if (RESULT_CLASS_RESULT_CODES.includes(CJSresultCode ?? 0) || RESULT_CLASS_VERDICTS.includes(Verdict ?? "")) {
    resultClass = adjournment ? ResultClass.UNRESULTED : ResultClass.JUDGEMENT_WITH_FINAL_RESULT
  } else if (!Verdict && adjournment) {
    resultClass = ResultClass.ADJOURNMENT_PRE_JUDGEMENT
  }

  result.ResultClass = resultClass
}

export default populateResultClass
