import type { Result } from "types/AnnotatedHearingOutcome"
import isAdjourned from "phase1/lib/result/isAdjourned"
import isAdjournedNoNextHearing from "phase1/lib/result/isAdjournedNoNextHearing"
import isWarrantIssued from "phase1/lib/result/isWarrantIssued"
import ResultClass from "phase1/types/ResultClass"
import isNotGuiltyVerdict from "phase1/enrichAho/enrichFunctions/enrichOffenceResultsPostPncEnrichment/isNotGuiltyVerdict"
import isResultClassCode from "phase1/enrichAho/enrichFunctions/enrichOffenceResultsPostPncEnrichment/isResultClassCode"

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
