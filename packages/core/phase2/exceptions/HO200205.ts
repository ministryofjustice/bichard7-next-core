import ExceptionCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/ExceptionCode"

import type { AnnotatedHearingOutcome, Result } from "../../types/AnnotatedHearingOutcome"
import type Exception from "../../types/Exception"
import type { ExceptionGenerator } from "../../types/ExceptionGenerator"

import isAmountSpecifiedInResultValid from "../../lib/createPncDisposalsFromResult/isAmountSpecifiedInResultValid"
import errorPaths from "../../lib/exceptions/errorPaths"
import forEachRecordableResult from "../../lib/forEachRecordableResult"

const firstAmountIndex = 0
const thirdAmountIndex = 2
const thirdDurationIndex = 2

const generateException = (
  result: Result,
  offenceIndex: number,
  resultIndex: number,
  amountSpecifiedInResultIndex: number
) => {
  const amount = result.AmountSpecifiedInResult?.[amountSpecifiedInResultIndex]?.Amount
  if (amount !== undefined && !isAmountSpecifiedInResultValid(amount)) {
    return [
      {
        code: ExceptionCode.HO200205,
        path: errorPaths.offence(offenceIndex).result(resultIndex).amountSpecifiedInResult(amountSpecifiedInResultIndex)
      }
    ]
  }

  return []
}

const HO200205: ExceptionGenerator = (hearingOutcome: AnnotatedHearingOutcome): Exception[] => {
  const exceptions: Exception[] = []

  forEachRecordableResult(hearingOutcome, (_, offenceIndex, result, resultIndex) => {
    exceptions.push(...generateException(result, offenceIndex, resultIndex, firstAmountIndex))
    if (result.Duration?.[thirdDurationIndex]) {
      exceptions.push(...generateException(result, offenceIndex, resultIndex, thirdAmountIndex))
    }
  })

  return exceptions
}

export default HO200205
