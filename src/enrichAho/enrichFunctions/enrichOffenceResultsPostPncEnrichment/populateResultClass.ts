import isAdjourned from "../../../lib/result/isAdjourned"
import isAdjournedNoNextHearing from "../../../lib/result/isAdjournedNoNextHearing"
import isWarrantIssued from "../../../lib/result/isWarrantIssued"
import type { Result } from "../../../types/AnnotatedHearingOutcome"
import ResultClass from "../../../types/ResultClass"

const resultClassPleas = ["ADM"]
const resultClassVerdicts = ["NG", "NC", "NA"]
const resultClassResultCodes = [
  // eslint-disable-next-line prettier/prettier
  2050, 2063, 4010, 1016, 2053, 2060, 2065, 1029, 1030, 1044, 2006,
  // eslint-disable-next-line prettier/prettier
  3047, 3101, 3102, 3103, 3104, 3105, 3106, 3107, 3108, 3109, 3110,
  // eslint-disable-next-line prettier/prettier
  3111, 3126, 3127, 3128, 3129, 3130, 3131, 3146, 3147, 3148, 3272
]

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
  } else if (resultClassResultCodes.includes(CJSresultCode ?? 0) || resultClassVerdicts.includes(Verdict ?? "")) {
    resultClass = adjournment ? ResultClass.UNRESULTED : ResultClass.JUDGEMENT_WITH_FINAL_RESULT
  } else if (!Verdict && adjournment) {
    resultClass = ResultClass.ADJOURNMENT_PRE_JUDGEMENT
  }

  result.ResultClass = resultClass
}

export default populateResultClass
