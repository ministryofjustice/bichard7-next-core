import ResultClass from "../../../phase1/types/ResultClass"
import type { Offence } from "../../../types/AnnotatedHearingOutcome"
import isRecordableResult from "../../isRecordableResult"

const disarrCompatibleResultClass = (offence: Offence): boolean => {
  return offence.Result.some(
    (result) =>
      isRecordableResult(result) &&
      (!result.ResultClass ||
        ![ResultClass.ADJOURNMENT_POST_JUDGEMENT, ResultClass.SENTENCE, ResultClass.UNRESULTED].includes(
          result.ResultClass
        ))
  )
}

export default disarrCompatibleResultClass
