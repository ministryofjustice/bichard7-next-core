import addExceptionsToAho from "../phase1/exceptions/addExceptionsToAho"
import errorPaths from "../phase1/lib/errorPaths"
import type { AnnotatedHearingOutcome } from "../types/AnnotatedHearingOutcome"
import { ExceptionCode } from "../types/ExceptionCode"
import isRecordableOffence from "./isRecordableOffence"
import isRecordableResult from "./isRecordableResult"

const allPncOffencesContainResults = (aho: AnnotatedHearingOutcome) => {
  const offences = aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence

  let allOffencesContainResults = true
  offences.forEach((offence, offenceIndex) => {
    if (offence.AddedByTheCourt) {
      return
    }

    if (!isRecordableOffence(offence)) {
      return
    }

    if (offence.Result.some(isRecordableResult)) {
      return
    }

    const errorPath =
      offence.CriminalProsecutionReference?.OffenceReason?.__type === "NationalOffenceReason"
        ? errorPaths.offence(offenceIndex).offenceReason.offenceCodeReason
        : errorPaths.offence(offenceIndex).offenceReason.localOffenceCode
    addExceptionsToAho(aho, ExceptionCode.HO200212, errorPath)
    allOffencesContainResults = false
  })

  if (!allOffencesContainResults) {
    aho.HasError = true
  }

  return allOffencesContainResults
}

export default allPncOffencesContainResults
