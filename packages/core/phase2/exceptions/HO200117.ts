import ExceptionCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/ExceptionCode"

import type { AnnotatedHearingOutcome, Offence } from "../../types/AnnotatedHearingOutcome"
import type Exception from "../../types/Exception"
import type { ExceptionGenerator } from "../../types/ExceptionGenerator"

import errorPaths from "../../lib/exceptions/errorPaths"
import isRecordableResult from "../../lib/isRecordableResult"

const MAX_ALLOWABLE_RECORDABLE_RESULTS = 10

const getErrorPath = (offence: Offence, offenceIndex: number) =>
  offence.CriminalProsecutionReference?.OffenceReason?.__type === "NationalOffenceReason"
    ? errorPaths.offence(offenceIndex).offenceReason.offenceCodeReason
    : errorPaths.offence(offenceIndex).offenceReason.localOffenceCode

const HO200117: ExceptionGenerator = (aho: AnnotatedHearingOutcome): Exception[] =>
  aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence.reduce(
    (exceptions: Exception[], offence, offenceIndex) => {
      const recordableResults = offence.Result.filter(isRecordableResult)

      if (recordableResults.length > MAX_ALLOWABLE_RECORDABLE_RESULTS) {
        exceptions.push({ code: ExceptionCode.HO200117, path: getErrorPath(offence, offenceIndex) })
      }

      return exceptions
    },
    []
  )

export default HO200117
