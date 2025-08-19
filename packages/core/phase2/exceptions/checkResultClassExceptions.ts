import type { AnnotatedHearingOutcome, Offence, Result } from "@moj-bichard7/common/types/AnnotatedHearingOutcome"

import isRecordableOffence from "../../lib/offences/isRecordableOffence"
import isRecordableResult from "../../lib/results/isRecordableResult"

type CheckExceptionFn = (offence: Offence, result: Result, offenceIndex: number, resultIndex: number) => void

const checkResultClassExceptions = (aho: AnnotatedHearingOutcome, checkExceptionFn: CheckExceptionFn) => {
  aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence.forEach((offence, offenceIndex) => {
    if (!isRecordableOffence(offence)) {
      return
    }

    offence.Result.forEach((result, resultIndex) => {
      if (!isRecordableResult(result)) {
        return
      }

      checkExceptionFn(offence, result, offenceIndex, resultIndex)
    })
  })
}

export default checkResultClassExceptions
