import ExceptionCode from "bichard7-next-data-latest/dist/types/ExceptionCode"
import type { AnnotatedHearingOutcome, Result } from "../../types/AnnotatedHearingOutcome"
import type Exception from "../../types/Exception"
import type { ExceptionGenerator } from "../../types/ExceptionGenerator"
import checkResultsMatchingPncDisposalsExceptions from "./checkResultsMatchingPncDisposalsExceptions"
import errorPaths from "../../lib/exceptions/errorPaths"
import isAmountSpecifiedInResultValid from "../lib/generateOperations/areAllResultsAlreadyPresentOnPnc/isMatchToPncAdjudicationAndDisposals/createPncDisposalFromResult/isAmountSpecifiedInResultValid"

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

const generator: ExceptionGenerator = (aho: AnnotatedHearingOutcome): Exception[] => {
  const exceptions: Exception[] = []

  checkResultsMatchingPncDisposalsExceptions(aho, (result, offenceIndex, resultIndex) => {
    exceptions.push(...generateException(result, offenceIndex, resultIndex, firstAmountIndex))
    if (result.Duration?.[thirdDurationIndex]) {
      exceptions.push(...generateException(result, offenceIndex, resultIndex, thirdAmountIndex))
    }
  })

  return exceptions
}

export default generator
