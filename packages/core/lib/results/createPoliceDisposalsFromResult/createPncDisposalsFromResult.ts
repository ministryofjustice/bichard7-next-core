import type { Result } from "@moj-bichard7/common/types/AnnotatedHearingOutcome"
import type { PoliceDisposal } from "@moj-bichard7/common/types/PoliceQueryResult"

import createPncDisposalByFirstAndSecondDurations from "./createPncDisposalByFirstAndSecondDurations"
import createPncDisposalByThirdDuration from "./createPncDisposalByThirdDuration"

const createPncDisposalsFromResult = (result: Result): PoliceDisposal[] => {
  const pncDisposalByFirstAndSecondDurations = createPncDisposalByFirstAndSecondDurations(result)
  const pncDisposalByThirdDuration = createPncDisposalByThirdDuration(result, pncDisposalByFirstAndSecondDurations.text)

  return [pncDisposalByFirstAndSecondDurations, ...(pncDisposalByThirdDuration ? [pncDisposalByThirdDuration] : [])]
}

export default createPncDisposalsFromResult
