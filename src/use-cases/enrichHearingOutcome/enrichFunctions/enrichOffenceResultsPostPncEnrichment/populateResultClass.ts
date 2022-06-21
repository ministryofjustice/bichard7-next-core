import {
  ADJOURNMENT_NO_NEXT_HEARING_RANGES,
  ADJOURNMENT_RANGES,
  ResultClass,
  RESULT_CLASS_PLEAS,
  RESULT_CLASS_RESULT_CODES,
  RESULT_CLASS_VERDICTS,
  WARRANT_ISSUED_CODES
} from "src/lib/properties"
import type { OrganisationUnitCodes, Result } from "src/types/AnnotatedHearingOutcome"

const isInRanges = (ranges: number[][], value: number) => ranges.some((range) => value >= range[0] && value <= range[1])

const populateResultClass = (result: Result, convictionDate: Date | undefined, dateOfHearing: Date) => {
  const nextHearingPresent = !!result.NextResultSourceOrganisation?.OrganisationUnitCode
  const adjourned = result.CJSresultCode ? isInRanges(ADJOURNMENT_RANGES, result.CJSresultCode) : false
  const warrantIssued = result.CJSresultCode ? isInRanges(WARRANT_ISSUED_CODES, result.CJSresultCode) : false
  const adjournedNoNextHearingDetails = result.CJSresultCode
    ? isInRanges(ADJOURNMENT_NO_NEXT_HEARING_RANGES, result.CJSresultCode)
    : false
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
