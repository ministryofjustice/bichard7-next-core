import type { Offence } from "../../../types/AnnotatedHearingOutcome"
import ResultClass from "../../../types/ResultClass"
import isRecordableResult from "../isRecordableResult"

const isResultClassCompatible = (resultClass?: ResultClass) =>
  !resultClass ||
  ![ResultClass.ADJOURNMENT_POST_JUDGEMENT, ResultClass.SENTENCE, ResultClass.UNRESULTED].includes(resultClass)

const disarrCompatibleResultClass = (offence: Offence): boolean => {
  return offence.Result.some((result) => isRecordableResult(result) && isResultClassCompatible(result.ResultClass))
}

export default disarrCompatibleResultClass
