import ResultClass from "../../../../phase1/types/ResultClass"
import type { Offence } from "../../../../types/AnnotatedHearingOutcome"
import isRecordableResult from "../../isRecordableResult"

const isResultClassCompatible = (resultClass?: ResultClass) =>
  !resultClass ||
  ![ResultClass.ADJOURNMENT_POST_JUDGEMENT, ResultClass.SENTENCE, ResultClass.UNRESULTED].includes(resultClass)

const disarrCompatibleResultClass = (offence: Offence): boolean => {
  return offence.Result.some((result) => isRecordableResult(result) && isResultClassCompatible(result.ResultClass))
}

export default disarrCompatibleResultClass
