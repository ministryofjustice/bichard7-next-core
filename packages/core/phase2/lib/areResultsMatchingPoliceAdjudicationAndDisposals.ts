import type { AnnotatedHearingOutcome, Offence, Result } from "@moj-bichard7/common/types/AnnotatedHearingOutcome"

import findPncCourtCase from "../../lib/policeGateway/pnc/findPncCourtCase"
import isRecordableResult from "../../lib/results/isRecordableResult"
import areResultsMatchingAPoliceDisposal from "./areResultsMatchingAPoliceDisposal"
import areResultsMatchingPncAdjudication from "./areResultsMatchingPncAdjudication"

export type CheckExceptionFn = (result: Result, offenceIndex: number, resultIndex: number) => void

const areResultsMatchingPoliceAdjudicationAndDisposals = (
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
        ) && areResultsMatchingAPoliceDisposal(offence, pncOffence.disposals ?? [], offenceIndex, checkExceptionFn)
    )
  )
}

export default areResultsMatchingPoliceAdjudicationAndDisposals
