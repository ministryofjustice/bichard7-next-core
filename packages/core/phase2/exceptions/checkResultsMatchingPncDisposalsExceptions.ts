import type { AnnotatedHearingOutcome, Offence, Result } from "../../types/AnnotatedHearingOutcome"
import isMatchToPncDisposal from "../lib/generateOperations/areAllResultsAlreadyPresentOnPnc/isMatchToPncAdjudicationAndDisposals/isMatchToPncDisposal"
import type { PncDisposal } from "../../types/PncQueryResult"
import isRecordableResult from "../lib/isRecordableResult"
import { isNonEmptyArray } from "../../types/NonEmptyArray"
import createPncAdjudicationFromAho from "../lib/generateOperations/areAllResultsAlreadyPresentOnPnc/isMatchToPncAdjudicationAndDisposals/createPncAdjudicationFromAho"
import isMatchToPncAdjudication from "../lib/generateOperations/areAllResultsAlreadyPresentOnPnc/isMatchToPncAdjudicationAndDisposals/isMatchToPncAdjudication"
import findPncCourtCase from "../lib/findPncCourtCase"

type CheckExceptionFn = (result: Result, offenceIndex: number, resultIndex: number) => void

const areResultsMatchingAPncDisposal = (
  offence: Offence,
  offenceIndex: number,
  disposals: PncDisposal[],
  checkExceptionFn: CheckExceptionFn
): boolean => {
  return offence.Result.every((result, resultIndex) => {
    checkExceptionFn(result, offenceIndex, resultIndex)

    return !isRecordableResult(result) || isMatchToPncDisposal(disposals, result)
  })
}

const isMatchToPncAdjudicationAndDisposals = (
  aho: AnnotatedHearingOutcome,
  offence: Offence,
  offenceIndex: number,
  checkExceptionFn: CheckExceptionFn
): boolean => {
  if (!offence.Result || !isNonEmptyArray(offence.Result)) {
    return false
  }

  const offenceReasonSequence = offence.CriminalProsecutionReference?.OffenceReasonSequence ?? undefined
  const adjFromAho = createPncAdjudicationFromAho(
    offence.Result,
    aho.AnnotatedHearingOutcome.HearingOutcome.Hearing.DateOfHearing
  )

  return !!findPncCourtCase(aho, offence)?.offences.some(
    (pncOffence) =>
      isMatchToPncAdjudication(adjFromAho, pncOffence, offenceReasonSequence) &&
      areResultsMatchingAPncDisposal(offence, offenceIndex, pncOffence.disposals ?? [], checkExceptionFn)
  )
}

const checkResultsMatchingPncDisposalsExceptions = (
  aho: AnnotatedHearingOutcome,
  checkExceptionFn: CheckExceptionFn
): void => {
  if (!aho.PncQuery?.pncId) {
    return
  }

  aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence.every((offence, offenceIndex) => {
    if (offence.Result.length === 0 || !offence.CriminalProsecutionReference?.OffenceReasonSequence) {
      return !offence.Result.some(isRecordableResult)
    }

    isMatchToPncAdjudicationAndDisposals(aho, offence, offenceIndex, checkExceptionFn)
  })
}

export default checkResultsMatchingPncDisposalsExceptions
