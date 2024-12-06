import ExceptionCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/ExceptionCode"

import type { AnnotatedHearingOutcome, Result } from "../../types/AnnotatedHearingOutcome"
import type Exception from "../../types/Exception"
import type { ExceptionGenerator } from "../../types/ExceptionGenerator"

import errorPaths from "../../lib/exceptions/errorPaths"
import isAmountSpecifiedInResultValid from "../lib/createPncDisposalsFromResult/isAmountSpecifiedInResultValid"
import isRecordableOffence from "../lib/isRecordableOffence"
import isRecordableResult from "../lib/isRecordableResult"

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

const HO200205: ExceptionGenerator = (aho: AnnotatedHearingOutcome): Exception[] => {
  const exceptions: Exception[] = []

  // TODO: Turn this loop into a reusable function
  for (const [
    offenceIndex,
    offence
  ] of aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence.entries()) {
    if (!isRecordableOffence(offence)) {
      continue
    }
    for (const [resultIndex, result] of offence.Result.entries()) {
      if (!isRecordableResult(result)) {
        continue
      }
      exceptions.push(...generateException(result, offenceIndex, resultIndex, firstAmountIndex))
      if (result.Duration?.[thirdDurationIndex]) {
        exceptions.push(...generateException(result, offenceIndex, resultIndex, thirdAmountIndex))
      }
    }
  }

  return exceptions
}

export default HO200205
