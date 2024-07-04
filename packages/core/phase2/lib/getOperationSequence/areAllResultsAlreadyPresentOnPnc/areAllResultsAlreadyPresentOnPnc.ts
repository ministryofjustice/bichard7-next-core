import type { AnnotatedHearingOutcome } from "../../../../types/AnnotatedHearingOutcome"
import { isNonEmptyArray } from "../../../../types/NonEmptyArray"
import isRecordableResult from "../../isRecordableResult"
import { isMatchToPncAdjAndDis } from "./isMatchToPncAdjAndDis"

const areAllResultsAlreadyPresentOnPnc = (aho: AnnotatedHearingOutcome): boolean => {
  if (!aho.PncQuery?.pncId) {
    return false
  }

  const offences = aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence

  return offences.every((offence, offenceIndex) => {
    const results = offence.Result
    const courtCaseReferenceNumber = offence.CourtCaseReferenceNumber ?? undefined
    const offenceReasonSequence = offence.CriminalProsecutionReference?.OffenceReasonSequence

    if (isNonEmptyArray(results) && !!offenceReasonSequence) {
      return isMatchToPncAdjAndDis(results, aho, courtCaseReferenceNumber, offenceIndex, offenceReasonSequence)
    }

    return !offence.Result.some(isRecordableResult)
  })
}

export default areAllResultsAlreadyPresentOnPnc
