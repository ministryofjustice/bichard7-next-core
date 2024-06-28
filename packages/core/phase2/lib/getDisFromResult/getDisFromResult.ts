import type { AnnotatedHearingOutcome } from "../../../types/AnnotatedHearingOutcome"
import type { NonEmptyArray } from "../../../types/NonEmptyArray"
import type { PncDisposal } from "../../../types/PncQueryResult"
import createPncDisposalByFirstAndSecondDurations from "./createPncDisposalByFirstAndSecondDurations"
import createPncDisposalByThirdDuration from "./createPncDisposalByThirdDuration"
import validateResultQualifierVariableCode from "./validateResultQualifierVariableCode"
import validateResultQualifierVariableDurationType from "./validateResultQualifierVariableDurationType"

const getDisFromResult = (
  aho: AnnotatedHearingOutcome,
  offenceIndex: number,
  resultIndex: number
): NonEmptyArray<PncDisposal> => {
  validateResultQualifierVariableCode(aho, offenceIndex, resultIndex)
  validateResultQualifierVariableDurationType(aho, offenceIndex, resultIndex)
  const pncDisposalByFirstAndSecondDurations = createPncDisposalByFirstAndSecondDurations(
    aho,
    offenceIndex,
    resultIndex
  )
  const pncDisposalByThirdDuration = createPncDisposalByThirdDuration(
    aho,
    offenceIndex,
    resultIndex,
    pncDisposalByFirstAndSecondDurations.text
  )

  return [pncDisposalByFirstAndSecondDurations, ...(pncDisposalByThirdDuration ? [pncDisposalByThirdDuration] : [])]
}

export default getDisFromResult
