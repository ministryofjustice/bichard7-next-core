import type { Offence } from "../../types/AnnotatedHearingOutcome"

import isRecordableResult from "../../lib/isRecordableResult"
import ResultClass from "../../types/ResultClass"

const isResultClassCompatible = (resultClass?: ResultClass) =>
  !resultClass ||
  ![ResultClass.ADJOURNMENT_POST_JUDGEMENT, ResultClass.SENTENCE, ResultClass.UNRESULTED].includes(resultClass)

const isResultCompatibleWithDisposal = (offence: Offence): boolean => {
  return offence.Result.some((result) => isRecordableResult(result) && isResultClassCompatible(result.ResultClass))
}

export default isResultCompatibleWithDisposal
