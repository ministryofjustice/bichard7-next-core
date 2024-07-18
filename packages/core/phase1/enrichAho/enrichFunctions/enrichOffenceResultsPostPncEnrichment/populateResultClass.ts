import isAdjournedNoNextHearing from "../../../../lib/isAdjournedNoNextHearing"
import type { Result } from "../../../../types/AnnotatedHearingOutcome"
import ResultClass from "../../../../types/ResultClass"
import isAdjourned from "../../../lib/result/isAdjourned"
import isWarrantIssued from "../../../lib/result/isWarrantIssued"
import isNotGuiltyVerdict from "./isNotGuiltyVerdict"
import isResultClassCode from "./isResultClassCode"

const resultClassPleas = ["ADM"]

const populateResultClass = (result: Result, convictionDate: Date | undefined, dateOfHearing: Date) => {
  const nextHearingPresent = !!result.NextResultSourceOrganisation?.OrganisationUnitCode
  const adjourned = isAdjourned(result.CJSresultCode)
  const warrantIssued = isWarrantIssued(result.CJSresultCode)
  const adjournedNoNextHearingDetails = isAdjournedNoNextHearing(result.CJSresultCode)
  const adjournment = nextHearingPresent || adjourned || warrantIssued || adjournedNoNextHearingDetails

  if (adjourned && !nextHearingPresent) {
    result.NextResultSourceOrganisation = undefined
  }

  const { Verdict, PleaStatus, CJSresultCode } = result

  let resultClass = ResultClass.UNRESULTED
  if (convictionDate && dateOfHearing && convictionDate.getTime() < dateOfHearing.getTime()) {
    resultClass = adjournment ? ResultClass.ADJOURNMENT_POST_JUDGEMENT : ResultClass.SENTENCE
  } else if (convictionDate && dateOfHearing && convictionDate.getTime() === dateOfHearing.getTime()) {
    resultClass = adjournment ? ResultClass.ADJOURNMENT_WITH_JUDGEMENT : ResultClass.JUDGEMENT_WITH_FINAL_RESULT
  } else if (resultClassPleas.includes(PleaStatus?.toString() ?? "") && !adjournment) {
    resultClass = ResultClass.JUDGEMENT_WITH_FINAL_RESULT
  } else if (isResultClassCode(CJSresultCode) || isNotGuiltyVerdict(Verdict)) {
    resultClass = adjournment ? ResultClass.UNRESULTED : ResultClass.JUDGEMENT_WITH_FINAL_RESULT
  } else if (!Verdict && adjournment) {
    resultClass = ResultClass.ADJOURNMENT_PRE_JUDGEMENT
  }

  result.ResultClass = resultClass
}

export default populateResultClass
