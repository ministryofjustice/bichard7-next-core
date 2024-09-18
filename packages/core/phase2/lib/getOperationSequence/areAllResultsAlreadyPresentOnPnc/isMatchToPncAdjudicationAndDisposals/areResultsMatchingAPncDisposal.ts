import type { Offence } from "../../../../../types/AnnotatedHearingOutcome"
import type Exception from "../../../../../types/Exception"
import type { ExceptionResult } from "../../../../../types/Exception"
import type { PncDisposal } from "../../../../../types/PncQueryResult"
import isRecordableResult from "../../../isRecordableResult"
import isMatchToPncDisposal from "./isMatchToPncDisposal"

const areResultsMatchingAPncDisposal = (
  offence: Offence,
  offenceIndex: number,
  disposals: PncDisposal[]
): ExceptionResult<boolean> => {
  const exceptions: Exception[] = []
  const allPncDisposalsMatchAhoResults = offence.Result.every((result, resultIndex) => {
    const matchResult = isMatchToPncDisposal(disposals, result, offenceIndex, resultIndex)
    exceptions.push(...matchResult.exceptions)

    return !isRecordableResult(result) || matchResult.value
  })

  return { value: allPncDisposalsMatchAhoResults, exceptions }
}

export default areResultsMatchingAPncDisposal
