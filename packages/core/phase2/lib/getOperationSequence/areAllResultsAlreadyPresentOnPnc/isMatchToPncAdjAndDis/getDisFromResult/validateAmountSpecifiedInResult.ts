import ExceptionCode from "bichard7-next-data-latest/dist/types/ExceptionCode"
import errorPaths from "../../../../../../phase1/lib/errorPaths"
import type { ExceptionResult } from "../../../../../../phase1/types/Exception"
import type { AnnotatedHearingOutcome } from "../../../../../../types/AnnotatedHearingOutcome"

const validateAmountSpecifiedInResult = (
  aho: AnnotatedHearingOutcome,
  offenceIndex: number,
  resultIndex: number,
  amountSpecifiedInResultIndex: number
): ExceptionResult<number | undefined> => {
  const amount =
    aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence[offenceIndex].Result[resultIndex]
      .AmountSpecifiedInResult?.[amountSpecifiedInResultIndex].Amount
  if (amount === undefined) {
    return { value: undefined, exceptions: [] }
  }

  const amountStr = amount.toString()
  if (amountStr.split(".")[0].length > 7 || amountStr.length > 10) {
    return {
      exceptions: [
        {
          code: ExceptionCode.HO200205,
          path: errorPaths
            .offence(offenceIndex)
            .result(resultIndex)
            .amountSpecifiedInResult(amountSpecifiedInResultIndex)
        }
      ],
      value: undefined
    }
  }

  return { value: amount, exceptions: [] }
}

export default validateAmountSpecifiedInResult
