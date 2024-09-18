import type { Result } from "../../../../../../types/AnnotatedHearingOutcome"
import type { ExceptionResult } from "../../../../../../types/Exception"
import type { NonEmptyArray } from "../../../../../../types/NonEmptyArray"
import type { PncDisposal } from "../../../../../../types/PncQueryResult"
import createPncDisposalByFirstAndSecondDurations from "./createPncDisposalByFirstAndSecondDurations"
import createPncDisposalByThirdDuration from "./createPncDisposalByThirdDuration"
import validateResultQualifierVariableCode from "./validateResultQualifierVariableCode"
import validateResultQualifierVariableDurationType from "./validateResultQualifierVariableDurationType"

const createPncDisposalFromResult = (
  result: Result,
  offenceIndex: number,
  resultIndex: number
): ExceptionResult<NonEmptyArray<PncDisposal>> => {
  const resultQualifierExceptions = validateResultQualifierVariableCode(result, offenceIndex, resultIndex)
  const durationTypeExceptions = validateResultQualifierVariableDurationType(result, offenceIndex, resultIndex)
  const { value: firstAndSecondDurationsDisposal, exceptions: firstAndSecondDurationsExceptions } =
    createPncDisposalByFirstAndSecondDurations(result, offenceIndex, resultIndex)
  const { value: thirdDurationDisposal, exceptions: thirdDurationExceptions } = createPncDisposalByThirdDuration(
    result,
    offenceIndex,
    resultIndex,
    firstAndSecondDurationsDisposal.text
  )

  const exceptions = [
    ...resultQualifierExceptions,
    ...durationTypeExceptions,
    ...firstAndSecondDurationsExceptions,
    ...thirdDurationExceptions
  ]

  return {
    exceptions,
    value: [firstAndSecondDurationsDisposal, ...(thirdDurationDisposal ? [thirdDurationDisposal] : [])]
  }
}

export default createPncDisposalFromResult
