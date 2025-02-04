import type { AnnotatedHearingOutcome, Offence, Result } from "../../types/AnnotatedHearingOutcome"

import isRecordableResult from "../../lib/isRecordableResult"
import isRecordableOffence from "../../lib/offences/isRecordableOffence"

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
