import type { Offence } from "@moj-bichard7/common/types/AnnotatedHearingOutcome"

import ResultClass from "@moj-bichard7/common/types/ResultClass"

import isRecordableResult from "./isRecordableResult"

const isResultClassCompatible = (resultClass?: ResultClass) =>
  !resultClass ||
  ![ResultClass.ADJOURNMENT_POST_JUDGEMENT, ResultClass.SENTENCE, ResultClass.UNRESULTED].includes(resultClass)

const isResultCompatibleWithDisposal = (offence: Offence): boolean => {
  return offence.Result.some((result) => isRecordableResult(result) && isResultClassCompatible(result.ResultClass))
}

export default isResultCompatibleWithDisposal
