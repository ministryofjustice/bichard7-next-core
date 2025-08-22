import type { AnnotatedHearingOutcome, Offence } from "@moj-bichard7/common/types/AnnotatedHearingOutcome"
import type Exception from "@moj-bichard7/common/types/Exception"

import ExceptionCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/ExceptionCode"
import errorPaths from "@moj-bichard7/common/aho/exceptions/errorPaths"

import type { ExceptionGenerator } from "../../types/ExceptionGenerator"

import isRecordableResult from "../../lib/results/isRecordableResult"

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
