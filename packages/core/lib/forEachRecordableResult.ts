import type { AnnotatedHearingOutcome, Offence, Result } from "../types/AnnotatedHearingOutcome"

import isRecordableOffence from "../phase2/lib/isRecordableOffence"
import isRecordableResult from "../phase2/lib/isRecordableResult"

type CallbackFunction = (offence: Offence, offenceIndex: number, result: Result, resultIndex: number) => void

const forEachRecordableResult = (hearingOutcome: AnnotatedHearingOutcome, callback: CallbackFunction) => {
  for (const [
    offenceIndex,
    offence
  ] of hearingOutcome.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.Offence.entries()) {
    if (!isRecordableOffence(offence)) {
      continue
    }

    for (const [resultIndex, result] of offence.Result.entries()) {
      if (!isRecordableResult(result)) {
        continue
      }

      callback(offence, offenceIndex, result, resultIndex)
    }
  }
}

export default forEachRecordableResult
