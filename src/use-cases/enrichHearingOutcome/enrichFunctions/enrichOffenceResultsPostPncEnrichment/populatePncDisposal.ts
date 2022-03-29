import {
  GUILTY_OF_ALTERNATIVE,
  PNC_DISPOSAL_TYPE,
  RESULT_ADJOURNMENT_WITH_JUDGEMENT,
  RESULT_JUDGEMENT_WITH_FINAL_RESULT,
  VICTIM_SURCHARGE_AMOUNT_IN_POUNDS,
  VICTIM_SURCHARGE_CREST_CODES
} from "src/lib/properties"
import type { AnnotatedHearingOutcome, Result } from "src/types/AnnotatedHearingOutcome"
import { lookupPncDisposalByCjsCode } from "src/use-cases/dataLookup"

const populatePncDisposal = (hearingOutcome: AnnotatedHearingOutcome, result: Result) => {
  const { CJSresultCode, ResultClass } = result
  const { CourtType } = hearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Hearing

  if (
    CourtType?.startsWith("M") &&
    VICTIM_SURCHARGE_CREST_CODES.includes(result.CRESTDisposalCode ?? "") &&
    result.ResultVariableText?.match(/victim\s*surcharge/i) &&
    result.AmountSpecifiedInResult?.some((amount) => amount === VICTIM_SURCHARGE_AMOUNT_IN_POUNDS)
  ) {
    result.PNCDisposalType = PNC_DISPOSAL_TYPE.VICTIM_SURCHARGE
  } else if (result.Verdict === GUILTY_OF_ALTERNATIVE) {
    result.PNCDisposalType = PNC_DISPOSAL_TYPE.GUILTY_OF_ALTERNATIVE
  } else {
    const adjudicationIndicator =
      ResultClass === RESULT_ADJOURNMENT_WITH_JUDGEMENT || ResultClass == RESULT_JUDGEMENT_WITH_FINAL_RESULT

    const pncDisposal = lookupPncDisposalByCjsCode(CJSresultCode ?? 0)
    result.PNCDisposalType =
      (adjudicationIndicator ? pncDisposal?.pncAdjudication : pncDisposal?.pncNonAdjudication) ??
      CJSresultCode?.toString()
  }
}

export default populatePncDisposal
