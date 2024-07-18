import { ExceptionResult } from "../../../../../../phase1/types/Exception"
import type { AnnotatedHearingOutcome } from "../../../../../../types/AnnotatedHearingOutcome"
import type { NonEmptyArray } from "../../../../../../types/NonEmptyArray"
import type { PncDisposal } from "../../../../../../types/PncQueryResult"
import createPncDisposalByFirstAndSecondDurations from "./createPncDisposalByFirstAndSecondDurations"
import createPncDisposalByThirdDuration from "./createPncDisposalByThirdDuration"
import validateResultQualifierVariableCode from "./validateResultQualifierVariableCode"
import validateResultQualifierVariableDurationType from "./validateResultQualifierVariableDurationType"

const getDisFromResult = (
  aho: AnnotatedHearingOutcome,
  offenceIndex: number,
  resultIndex: number
): ExceptionResult<NonEmptyArray<PncDisposal>> => {
  const resultQualifierVariableCodeExceptions = validateResultQualifierVariableCode(aho, offenceIndex, resultIndex)
  const resultQualifierVariableDurationTypeExceptions = validateResultQualifierVariableDurationType(
    aho,
    offenceIndex,
    resultIndex
  )
  const { value: pncDisposalByFirstAndSecondDurations, exceptions: firstAndSecondDurationsExceptions } =
    createPncDisposalByFirstAndSecondDurations(aho, offenceIndex, resultIndex)
  const { value: pncDisposalByThirdDuration, exceptions: thirdDurationExceptions } = createPncDisposalByThirdDuration(
    aho,
    offenceIndex,
    resultIndex,
    pncDisposalByFirstAndSecondDurations.text
  )

  const exceptions = [
    ...resultQualifierVariableCodeExceptions,
    ...resultQualifierVariableDurationTypeExceptions,
    ...firstAndSecondDurationsExceptions,
    ...thirdDurationExceptions
  ]

  return {
    exceptions,
    value: [pncDisposalByFirstAndSecondDurations, ...(pncDisposalByThirdDuration ? [pncDisposalByThirdDuration] : [])]
  }
}

export default getDisFromResult
