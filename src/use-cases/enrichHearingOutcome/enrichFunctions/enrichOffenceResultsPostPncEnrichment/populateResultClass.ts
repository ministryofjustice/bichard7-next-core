import type { OrganisationUnit, Result } from "src/types/AnnotatedHearingOutcome"
import {
  ADJOURNMENT_NO_NEXT_HEARING_RANGES,
  ADJOURNMENT_RANGES,
  CROWN_COURT,
  RESULT_ADJOURNMENT_POST_JUDGEMENT,
  RESULT_ADJOURNMENT_PRE_JUDGEMENT,
  RESULT_ADJOURNMENT_WITH_JUDGEMENT,
  RESULT_CLASS_PLEAS,
  RESULT_CLASS_RESULT_CODES,
  RESULT_CLASS_VERDICTS,
  RESULT_JUDGEMENT_WITH_FINAL_RESULT,
  RESULT_SENTENCE,
  RESULT_UNRESULTED,
  WARRANT_ISSUED_CODES
} from "src/lib/properties"

const isInRanges = (ranges: number[][], value: number) => ranges.some((range) => value >= range[0] && value <= range[1])

const populateResultClass = (
  result: Result,
  convictionDate: Date | undefined,
  dateOfHearing: Date,
  courtType: string | undefined
) => {
  const nextHearingPresent = !!result.NextResultSourceOrganisation?.OrganisationUnitCode
  if (courtType === CROWN_COURT) {
    return
  }
  const adjourned = result.CJSresultCode ? isInRanges(ADJOURNMENT_RANGES, result.CJSresultCode) : false
  const warrantIssued = result.CJSresultCode ? isInRanges(WARRANT_ISSUED_CODES, result.CJSresultCode) : false
  const adjournedNoNextHearingDetails = result.CJSresultCode
    ? isInRanges(ADJOURNMENT_NO_NEXT_HEARING_RANGES, result.CJSresultCode)
    : false
  const adjournment = nextHearingPresent || adjourned || warrantIssued || adjournedNoNextHearingDetails

  if (adjourned && !nextHearingPresent) {
    result.NextResultSourceOrganisation = {} as OrganisationUnit
  }

  const { Verdict, PleaStatus, CJSresultCode } = result

  let resultClass = RESULT_UNRESULTED
  if (convictionDate && dateOfHearing && convictionDate.getTime() < dateOfHearing.getTime()) {
    resultClass = adjournment ? RESULT_ADJOURNMENT_POST_JUDGEMENT : RESULT_SENTENCE
  } else if (convictionDate && dateOfHearing && convictionDate.getTime() === dateOfHearing.getTime()) {
    resultClass = adjournment ? RESULT_ADJOURNMENT_WITH_JUDGEMENT : RESULT_JUDGEMENT_WITH_FINAL_RESULT
  } else if (RESULT_CLASS_PLEAS.includes(PleaStatus?.toString() ?? "") && !adjournment) {
    resultClass = RESULT_JUDGEMENT_WITH_FINAL_RESULT
  } else if (RESULT_CLASS_RESULT_CODES.includes(CJSresultCode ?? 0) || RESULT_CLASS_VERDICTS.includes(Verdict ?? "")) {
    resultClass = adjournment ? RESULT_UNRESULTED : RESULT_JUDGEMENT_WITH_FINAL_RESULT
  } else if (!Verdict && adjournment) {
    resultClass = RESULT_ADJOURNMENT_PRE_JUDGEMENT
  }

  result.ResultClass = resultClass
}

export default populateResultClass
