import type { AnnotatedHearingOutcome, Offence, Result } from "../../types/AnnotatedHearingOutcome"

import isRecordableResult from "../../lib/isRecordableResult"
import areResultsMatchingAPncDisposal from "./areResultsMatchingAPncDisposal"
import areResultsMatchingPncAdjudication from "./areResultsMatchingPncAdjudication"
import findPncCourtCase from "./findPncCourtCase"

export type CheckExceptionFn = (result: Result, offenceIndex: number, resultIndex: number) => void

const areResultsMatchingPncAdjudicationAndDisposals = (
  aho: AnnotatedHearingOutcome,
  offence: Offence,
  offenceIndex?: number,
  checkExceptionFn?: CheckExceptionFn
): boolean => {
  const offenceReasonSequence = offence.CriminalProsecutionReference?.OffenceReasonSequence ?? undefined

  if (offence.Result.length === 0 || !offenceReasonSequence) {
    return !offence.Result.some(isRecordableResult)
  }

  return (
    !!aho.PncQuery?.pncId &&
    !!findPncCourtCase(aho, offence)?.offences.some(
      (pncOffence) =>
        areResultsMatchingPncAdjudication(
          offence.Result,
          aho.AnnotatedHearingOutcome.HearingOutcome.Hearing.DateOfHearing,
          offenceReasonSequence,
          pncOffence
        ) && areResultsMatchingAPncDisposal(offence, pncOffence.disposals ?? [], offenceIndex, checkExceptionFn)
    )
  )
}

export default areResultsMatchingPncAdjudicationAndDisposals
