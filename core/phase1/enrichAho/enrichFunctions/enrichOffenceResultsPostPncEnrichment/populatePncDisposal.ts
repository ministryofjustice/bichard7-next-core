import type { AnnotatedHearingOutcome, Result } from "core/common/types/AnnotatedHearingOutcome"
import { lookupPncDisposalByCjsCode } from "../../../dataLookup"
import ResultClass from "../../../types/ResultClass"

const victimSurchargeCrestCodes = [
  "COM",
  "COMINST",
  "COMTIME",
  "FD",
  "FDINST",
  "FDTIME",
  "FINE",
  "PC",
  "PCINST",
  "PCTIME"
]
const victimSurchargeAmountInPounds = 15
const guiltyOfAlternative = "NA"
const pncDisposalTypes = {
  VICTIM_SURCHARGE: 3117,
  GUILTY_OF_ALTERNATIVE: 2060
}

const populatePncDisposal = (hearingOutcome: AnnotatedHearingOutcome, result: Result) => {
  const {
    CJSresultCode,
    ResultClass: resultClass,
    CRESTDisposalCode,
    ResultVariableText,
    AmountSpecifiedInResult,
    Verdict
  } = result
  const { CourtType } = hearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Hearing

  if (
    CourtType?.startsWith("M") &&
    victimSurchargeCrestCodes.includes(CRESTDisposalCode ?? "") &&
    ResultVariableText?.match(/victim\s*surcharge/i) &&
    AmountSpecifiedInResult?.some((amount) => amount.Amount === victimSurchargeAmountInPounds)
  ) {
    result.PNCDisposalType = pncDisposalTypes.VICTIM_SURCHARGE
  } else if (Verdict === guiltyOfAlternative) {
    result.PNCDisposalType = pncDisposalTypes.GUILTY_OF_ALTERNATIVE
  } else {
    const adjudicationIndicator =
      resultClass === ResultClass.ADJOURNMENT_WITH_JUDGEMENT || resultClass == ResultClass.JUDGEMENT_WITH_FINAL_RESULT

    const pncDisposal = lookupPncDisposalByCjsCode(CJSresultCode ?? 0)
    const pncDisposalType = adjudicationIndicator ? pncDisposal?.pncAdjudication : pncDisposal?.pncNonAdjudication
    if (pncDisposalType) {
      result.PNCDisposalType = parseInt(pncDisposalType, 10)
    } else {
      result.PNCDisposalType = CJSresultCode
    }
  }
}

export default populatePncDisposal
