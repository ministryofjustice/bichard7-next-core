import type { AnnotatedHearingOutcome, Offence, Result } from "@moj-bichard7/common/types/AnnotatedHearingOutcome"

import findPncCourtCase from "../../lib/policeGateway/pnc/findPncCourtCase"
import isRecordableResult from "../../lib/results/isRecordableResult"
import areResultsMatchingAPoliceDisposal from "./areResultsMatchingAPoliceDisposal"
import areResultsMatchingPoliceAdjudication from "./areResultsMatchingPoliceAdjudication"

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
      (policeOffence) =>
        areResultsMatchingPoliceAdjudication(
          offence.Result,
          aho.AnnotatedHearingOutcome.HearingOutcome.Hearing.DateOfHearing,
          offenceReasonSequence,
          policeOffence
        ) && areResultsMatchingAPoliceDisposal(offence, policeOffence.disposals ?? [], offenceIndex, checkExceptionFn)
    )
  )
}

export default areResultsMatchingPoliceAdjudicationAndDisposals
