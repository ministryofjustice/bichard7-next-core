import ExceptionCode from "bichard7-next-data-latest/dist/types/ExceptionCode"
import errorPaths from "../../../lib/exceptions/errorPaths"
import type { AnnotatedHearingOutcome, Offence } from "../../../types/AnnotatedHearingOutcome"
import type Exception from "../../../types/Exception"
import isRecordableResult from "../isRecordableResult"

const getErrorPath = (offence: Offence, offenceIndex: number) =>
  offence.CriminalProsecutionReference?.OffenceReason?.__type === "NationalOffenceReason"
    ? errorPaths.offence(offenceIndex).offenceReason.offenceCodeReason
    : errorPaths.offence(offenceIndex).offenceReason.localOffenceCode

const checkNoSequenceConditions = (aho: AnnotatedHearingOutcome): Exception[] => {
  const exceptions: Exception[] = []
  const offences = aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence

  offences.forEach((offence, offenceIndex) => {
    if (offence.Result.filter(isRecordableResult).length > 10) {
      exceptions.push({ code: ExceptionCode.HO200117, path: getErrorPath(offence, offenceIndex) })
    }
  })

  return exceptions
}

export default checkNoSequenceConditions
