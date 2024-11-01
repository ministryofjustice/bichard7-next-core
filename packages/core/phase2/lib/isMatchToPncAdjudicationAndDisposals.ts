import type { AnnotatedHearingOutcome, Offence, Result } from "../../types/AnnotatedHearingOutcome"
import findPncCourtCase from "./findPncCourtCase"
import isRecordableResult from "./isRecordableResult"
import isMatchToPncAdjudication from "./isMatchToPncAdjudication"
import areResultsMatchingAPncDisposal from "./areResultsMatchingAPncDisposal"

export type CheckExceptionFn = (result: Result, offenceIndex: number, resultIndex: number) => void

const isMatchToPncAdjudicationAndDisposals = (
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
        isMatchToPncAdjudication(
          offence.Result,
          aho.AnnotatedHearingOutcome.HearingOutcome.Hearing.DateOfHearing,
          pncOffence,
          offenceReasonSequence
        ) && areResultsMatchingAPncDisposal(offence, pncOffence.disposals ?? [], offenceIndex, checkExceptionFn)
    )
  )
}

export default isMatchToPncAdjudicationAndDisposals
