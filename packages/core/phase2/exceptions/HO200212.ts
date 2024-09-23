import ExceptionCode from "bichard7-next-data-latest/dist/types/ExceptionCode"
import type { AnnotatedHearingOutcome, Offence } from "../../types/AnnotatedHearingOutcome"
import type Exception from "../../types/Exception"
import type { ExceptionGenerator } from "../../types/ExceptionGenerator"
import isRecordableResult from "../lib/isRecordableResult"
import isRecordableOffence from "../lib/isRecordableOffence"
import errorPaths from "../../lib/exceptions/errorPaths"

const getErrorPath = (offence: Offence, offenceIndex: number) =>
  offence.CriminalProsecutionReference?.OffenceReason?.__type === "NationalOffenceReason"
    ? errorPaths.offence(offenceIndex).offenceReason.offenceCodeReason
    : errorPaths.offence(offenceIndex).offenceReason.localOffenceCode

const generator: ExceptionGenerator = (aho: AnnotatedHearingOutcome): Exception[] =>
  aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence.reduce(
    (exceptions: Exception[], offence, offenceIndex) => {
      if (!offence.AddedByTheCourt && isRecordableOffence(offence) && !offence.Result.some(isRecordableResult)) {
        exceptions.push({ code: ExceptionCode.HO200212, path: getErrorPath(offence, offenceIndex) })
      }

      return exceptions
    },
    []
  )

export default generator
