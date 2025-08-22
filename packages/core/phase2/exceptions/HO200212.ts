import type { AnnotatedHearingOutcome, Offence } from "@moj-bichard7/common/types/AnnotatedHearingOutcome"
import type Exception from "@moj-bichard7/common/types/Exception"

import ExceptionCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/ExceptionCode"
import errorPaths from "@moj-bichard7/common/aho/exceptions/errorPaths"

import type { ExceptionGenerator } from "../../types/ExceptionGenerator"

import isRecordableOffence from "../../lib/offences/isRecordableOffence"
import isRecordableResult from "../../lib/results/isRecordableResult"

const getErrorPath = (offence: Offence, offenceIndex: number) =>
  offence.CriminalProsecutionReference?.OffenceReason?.__type === "NationalOffenceReason"
    ? errorPaths.offence(offenceIndex).offenceReason.offenceCodeReason
    : errorPaths.offence(offenceIndex).offenceReason.localOffenceCode

const HO200212: ExceptionGenerator = (aho: AnnotatedHearingOutcome): Exception[] =>
  aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence.reduce(
    (exceptions: Exception[], offence, offenceIndex) => {
      if (!offence.AddedByTheCourt && isRecordableOffence(offence) && !offence.Result.some(isRecordableResult)) {
        exceptions.push({ code: ExceptionCode.HO200212, path: getErrorPath(offence, offenceIndex) })
      }

      return exceptions
    },
    []
  )

export default HO200212
