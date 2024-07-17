import ExceptionCode from "bichard7-next-data-latest/dist/types/ExceptionCode"
import errorPaths from "../../phase1/lib/errorPaths"
import Exception from "../../phase1/types/Exception"
import type { AnnotatedHearingOutcome, Offence } from "../../types/AnnotatedHearingOutcome"
import isRecordableOffence from "./isRecordableOffence"
import isRecordableResult from "./isRecordableResult"

const getErrorPath = (offence: Offence, offenceIndex: number) =>
  offence.CriminalProsecutionReference?.OffenceReason?.__type === "NationalOffenceReason"
    ? errorPaths.offence(offenceIndex).offenceReason.offenceCodeReason
    : errorPaths.offence(offenceIndex).offenceReason.localOffenceCode

const allPncOffencesContainResults = (aho: AnnotatedHearingOutcome): Exception[] => {
  const exceptions: Exception[] = []
  const offences = aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence

  offences.forEach((offence, offenceIndex) => {
    if (offence.AddedByTheCourt || !isRecordableOffence(offence) || offence.Result.some(isRecordableResult)) {
      return
    }

    exceptions.push({ code: ExceptionCode.HO200212, path: getErrorPath(offence, offenceIndex) })
    aho.HasError = true
  })

  return exceptions
}

export default allPncOffencesContainResults
