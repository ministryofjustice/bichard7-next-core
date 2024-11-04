import type { Offence } from "../../types/AnnotatedHearingOutcome"
import type { PncDisposal } from "../../types/PncQueryResult"
import isRecordableResult from "./isRecordableResult"
import isMatchToPncDisposal from "./isMatchToPncDisposal"
import type { CheckExceptionFn } from "./areResultsMatchingPncAdjudicationAndDisposals"

const areResultsMatchingAPncDisposal = (
  offence: Offence,
  disposals: PncDisposal[],
  offenceIndex?: number,
  checkExceptionFn?: CheckExceptionFn
): boolean =>
  offence.Result.every((result, resultIndex) => {
    if (checkExceptionFn && offenceIndex !== undefined) {
      checkExceptionFn(result, offenceIndex, resultIndex)
    }

    return !isRecordableResult(result) || isMatchToPncDisposal(disposals, result)
  })

export default areResultsMatchingAPncDisposal
