import ExceptionCode from "bichard7-next-data-latest/dist/types/ExceptionCode"
import errorPaths from "../../lib/exceptions/errorPaths"
import type { AnnotatedHearingOutcome, Offence } from "../../types/AnnotatedHearingOutcome"
import type Exception from "../../types/Exception"
import isRecordableOffence from "./isRecordableOffence"
import isRecordableResult from "./isRecordableResult"

const getErrorPath = (offence: Offence, offenceIndex: number) =>
  offence.CriminalProsecutionReference?.OffenceReason?.__type === "NationalOffenceReason"
    ? errorPaths.offence(offenceIndex).offenceReason.offenceCodeReason
    : errorPaths.offence(offenceIndex).offenceReason.localOffenceCode

const allPncOffencesContainResults = (aho: AnnotatedHearingOutcome): Exception[] => {
  const offences = aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence

  return offences
    .map((offence, offenceIndex) => {
      if (offence.AddedByTheCourt || !isRecordableOffence(offence) || offence.Result.some(isRecordableResult)) {
        return
      }

      return { code: ExceptionCode.HO200212, path: getErrorPath(offence, offenceIndex) }
    })
    .filter((exception) => !!exception)
}

export default allPncOffencesContainResults
