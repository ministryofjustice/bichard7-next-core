import type { AnnotatedHearingOutcome } from "../types/AnnotatedHearingOutcome"
import { isNonEmptyArray } from "../types/NonEmptyArray"
import isMatchToPncAdjAndDis from "./isMatchToPncAdjAndDis"
import isRecordableResult from "./isRecordableResult"

const areAllResultsAlreadyPresentOnPnc = (aho: AnnotatedHearingOutcome): boolean => {
  if (!aho.PncQuery?.pncId) {
    return false
  }

  const offences = aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence

  //We need to include UpdateMessageSequenceBuilderImpl.java:605-616 here if crown court support is re-introduced.
  return offences.every((offence, offenceIndex) => {
    const results = offence.Result
    const courtCaseReferenceNumber = offence.CourtCaseReferenceNumber ? offence.CourtCaseReferenceNumber : undefined
    const offenceReasonSequence = offence.CriminalProsecutionReference?.OffenceReasonSequence

    if (isNonEmptyArray(results) && !!offenceReasonSequence) {
      return isMatchToPncAdjAndDis(results, aho, courtCaseReferenceNumber, offenceIndex, offenceReasonSequence)
    }

    return !offence.Result.some(isRecordableResult) // UpdateMessageSequenceBuilderImpl.java:638
  })
}

export default areAllResultsAlreadyPresentOnPnc
