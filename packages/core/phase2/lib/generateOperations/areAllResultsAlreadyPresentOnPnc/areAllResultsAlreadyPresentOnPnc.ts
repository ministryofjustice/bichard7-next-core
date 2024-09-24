import type { AnnotatedHearingOutcome } from "../../../../types/AnnotatedHearingOutcome"
import type Exception from "../../../../types/Exception"
import type { ExceptionResult } from "../../../../types/Exception"
import isRecordableResult from "../../isRecordableResult"
import { isMatchToPncAdjudicationAndDisposals } from "./isMatchToPncAdjudicationAndDisposals"

const areAllResultsAlreadyPresentOnPnc = (aho: AnnotatedHearingOutcome): ExceptionResult<boolean> => {
  if (!aho.PncQuery?.pncId) {
    return { value: false, exceptions: [] }
  }

  const offences = aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence

  const exceptions: Exception[] = []
  const allResultsOnPnc = offences.every((offence, offenceIndex) => {
    if (offence.Result.length === 0 || !offence.CriminalProsecutionReference?.OffenceReasonSequence) {
      return !offence.Result.some(isRecordableResult)
    }

    const {
      value: isMatchToPncAdjudicationAndDisposalsResult,
      exceptions: isMatchToPncAdjudicationAndDisposalsExceptions
    } = isMatchToPncAdjudicationAndDisposals(aho, offence, offenceIndex)
    exceptions.push(...isMatchToPncAdjudicationAndDisposalsExceptions)
    return isMatchToPncAdjudicationAndDisposalsResult
  })

  return { value: allResultsOnPnc, exceptions }
}

export default areAllResultsAlreadyPresentOnPnc
