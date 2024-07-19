import { AnnotatedHearingOutcome, Result } from "../../../../../types/AnnotatedHearingOutcome"
import Exception, { ExceptionResult } from "../../../../../types/Exception"
import type { PncDisposal } from "../../../../../types/PncQueryResult"
import isRecordableResult from "../../../isRecordableResult"
import isMatchToPncDis from "./isMatchToPncDis"

const allRecordableResultsMatchAPncDisposal = (
    results: Result[],
    disposals: PncDisposal[],
    aho: AnnotatedHearingOutcome,
    offenceIndex: number
  ): ExceptionResult<boolean> => {
    const exceptions: Exception[] = []
    const allPncDisposalsMatch = results.every((result, resultIndex) => {
      const { value: isPncDisposalMatch, exceptions: matchToPncDisExceptions } = isMatchToPncDis(disposals, aho, offenceIndex, resultIndex)
      exceptions.push(...matchToPncDisExceptions)
  
      return !isRecordableResult(result) || isPncDisposalMatch
    })
  
    return { value: allPncDisposalsMatch, exceptions }
  }

  
  export default allRecordableResultsMatchAPncDisposal