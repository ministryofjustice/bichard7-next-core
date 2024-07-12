import addExceptionsToAho from "../../phase1/exceptions/addExceptionsToAho"
import errorPaths from "../../phase1/lib/errorPaths"
import type { AnnotatedHearingOutcome, Offence } from "../../types/AnnotatedHearingOutcome"
import ExceptionCode from "bichard7-next-data-latest/dist/types/ExceptionCode"
import isRecordableOffence from "./isRecordableOffence"
import isRecordableResult from "./isRecordableResult"

const getErrorPath = (offence: Offence, offenceIndex: number) =>
  offence.CriminalProsecutionReference?.OffenceReason?.__type === "NationalOffenceReason"
    ? errorPaths.offence(offenceIndex).offenceReason.offenceCodeReason
    : errorPaths.offence(offenceIndex).offenceReason.localOffenceCode

const allPncOffencesContainResults = (aho: AnnotatedHearingOutcome) => {
  const offences = aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence

  let allOffencesContainResults = true
  offences.forEach((offence, offenceIndex) => {
    if (offence.AddedByTheCourt || !isRecordableOffence(offence) || offence.Result.some(isRecordableResult)) {
      return
    }

    addExceptionsToAho(aho, ExceptionCode.HO200212, getErrorPath(offence, offenceIndex))
    allOffencesContainResults = false
    aho.HasError = true
  })

  return allOffencesContainResults
}

export default allPncOffencesContainResults
