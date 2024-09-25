import type { Result } from "../../../../../../types/AnnotatedHearingOutcome"
import type { NonEmptyArray } from "../../../../../../types/NonEmptyArray"
import type { PncDisposal } from "../../../../../../types/PncQueryResult"
import createPncDisposalByFirstAndSecondDurations from "./createPncDisposalByFirstAndSecondDurations"
import createPncDisposalByThirdDuration from "./createPncDisposalByThirdDuration"

const createPncDisposalFromResult = (result: Result): NonEmptyArray<PncDisposal> => {
  const firstAndSecondDurationsDisposal = createPncDisposalByFirstAndSecondDurations(result)
  const thirdDurationDisposal = createPncDisposalByThirdDuration(result, firstAndSecondDurationsDisposal.text)

  return [firstAndSecondDurationsDisposal, ...(thirdDurationDisposal ? [thirdDurationDisposal] : [])]
}

export default createPncDisposalFromResult
