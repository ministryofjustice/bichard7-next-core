import type { Result } from "../../../../../../types/AnnotatedHearingOutcome"
import type { ExceptionResult } from "../../../../../../types/Exception"
import type { NonEmptyArray } from "../../../../../../types/NonEmptyArray"
import type { PncDisposal } from "../../../../../../types/PncQueryResult"
import createPncDisposalByFirstAndSecondDurations from "./createPncDisposalByFirstAndSecondDurations"
import createPncDisposalByThirdDuration from "./createPncDisposalByThirdDuration"
import validateResultQualifierVariableDurationType from "./validateResultQualifierVariableDurationType"

const createPncDisposalFromResult = (
  result: Result,
  offenceIndex: number,
  resultIndex: number
): ExceptionResult<NonEmptyArray<PncDisposal>> => {
  const durationTypeExceptions = validateResultQualifierVariableDurationType(result, offenceIndex, resultIndex)
  const firstAndSecondDurationsDisposal = createPncDisposalByFirstAndSecondDurations(result)
  const thirdDurationDisposal = createPncDisposalByThirdDuration(result, firstAndSecondDurationsDisposal.text)

  const exceptions = [...durationTypeExceptions]

  return {
    exceptions,
    value: [firstAndSecondDurationsDisposal, ...(thirdDurationDisposal ? [thirdDurationDisposal] : [])]
  }
}

export default createPncDisposalFromResult
