import type { Result } from "../../../types/AnnotatedHearingOutcome"
import type { PncDisposal } from "../../../types/PncQueryResult"
import createPncDisposalByFirstAndSecondDurations from "./createPncDisposalByFirstAndSecondDurations"
import createPncDisposalByThirdDuration from "./createPncDisposalByThirdDuration"

const createPncDisposalsFromResult = (result: Result): PncDisposal[] => {
  const pncDisposalByFirstAndSecondDurations = createPncDisposalByFirstAndSecondDurations(result)
  const pncDisposalByThirdDuration = createPncDisposalByThirdDuration(result, pncDisposalByFirstAndSecondDurations.text)

  return [pncDisposalByFirstAndSecondDurations, ...(pncDisposalByThirdDuration ? [pncDisposalByThirdDuration] : [])]
}

export default createPncDisposalsFromResult
