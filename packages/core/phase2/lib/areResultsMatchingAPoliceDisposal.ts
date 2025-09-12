import type { Offence } from "@moj-bichard7/common/types/AnnotatedHearingOutcome"
import type { PoliceDisposal } from "@moj-bichard7/common/types/PoliceQueryResult"

import type { CheckExceptionFn } from "./areResultsMatchingPoliceAdjudicationAndDisposals"

import isRecordableResult from "../../lib/results/isRecordableResult"
import isResultMatchingAPoliceDisposal from "./isResultMatchingAPoliceDisposal"

const areResultsMatchingAPoliceDisposal = (
  offence: Offence,
  disposals: PoliceDisposal[],
  offenceIndex?: number,
  checkExceptionFn?: CheckExceptionFn
): boolean =>
  offence.Result.every((result, resultIndex) => {
    if (checkExceptionFn && offenceIndex !== undefined) {
      checkExceptionFn(result, offenceIndex, resultIndex)
    }

    return !isRecordableResult(result) || isResultMatchingAPoliceDisposal(result, disposals)
  })

export default areResultsMatchingAPoliceDisposal
