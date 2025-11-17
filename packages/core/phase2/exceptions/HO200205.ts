import type { AnnotatedHearingOutcome, Result } from "@moj-bichard7/common/types/AnnotatedHearingOutcome"
import type Exception from "@moj-bichard7/common/types/Exception"

import ExceptionCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/ExceptionCode"
import errorPaths from "@moj-bichard7/common/aho/exceptions/errorPaths"

import type { ExceptionGenerator } from "../../types/ExceptionGenerator"

import forEachRecordableResult from "../../lib/offences/forEachRecordableResult"
import isAmountSpecifiedInResultValid from "../../lib/results/createPoliceDisposalsFromResult/isAmountSpecifiedInResultValid"

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
