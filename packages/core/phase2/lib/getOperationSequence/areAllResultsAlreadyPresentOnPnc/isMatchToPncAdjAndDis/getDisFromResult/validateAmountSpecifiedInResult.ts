import addExceptionsToAho from "../../../../../../phase1/exceptions/addExceptionsToAho"
import errorPaths from "../../../../../../phase1/lib/errorPaths"
import type { AnnotatedHearingOutcome } from "../../../../../../types/AnnotatedHearingOutcome"
import ExceptionCode from "bichard7-next-data-latest/dist/types/ExceptionCode"

const validateAmountSpecifiedInResult = (
  aho: AnnotatedHearingOutcome,
  offenceIndex: number,
  resultIndex: number,
  amountSpecifiedInResultIndex: number
): number | undefined => {
  const amount =
    aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[offenceIndex].Result[resultIndex]
      .AmountSpecifiedInResult?.[amountSpecifiedInResultIndex].Amount
  if (amount === undefined) {
    return undefined
  }

  const amountStr = amount.toString()
  if (amountStr.split(".")[0].length > 7 || amountStr.length > 10) {
    addExceptionsToAho(
      aho,
      ExceptionCode.HO200205,
      errorPaths.offence(offenceIndex).result(resultIndex).amountSpecifiedInResult(amountSpecifiedInResultIndex)
    )

    return undefined
  }

  return amount
}

export default validateAmountSpecifiedInResult
