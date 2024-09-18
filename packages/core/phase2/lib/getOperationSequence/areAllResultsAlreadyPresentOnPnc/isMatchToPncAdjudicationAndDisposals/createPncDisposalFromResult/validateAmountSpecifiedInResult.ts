import ExceptionCode from "bichard7-next-data-latest/dist/types/ExceptionCode"
import errorPaths from "../../../../../../lib/exceptions/errorPaths"
import type { Result } from "../../../../../../types/AnnotatedHearingOutcome"
import type { ExceptionResult } from "../../../../../../types/Exception"

const validateAmountSpecifiedInResult = (
  result: Result,
  offenceIndex: number,
  resultIndex: number,
  amountSpecifiedInResultIndex: number
): ExceptionResult<number | undefined> => {
  const amount = result.AmountSpecifiedInResult?.[amountSpecifiedInResultIndex].Amount
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
