import type { Result } from "@moj-bichard7/common/types/AnnotatedHearingOutcome"
import type { PoliceDisposal } from "@moj-bichard7/common/types/PoliceQueryResult"

import createPoliceDisposalByFirstAndSecondDurations from "./createPoliceDisposalByFirstAndSecondDurations"
import createPoliceDisposalByThirdDuration from "./createPoliceDisposalByThirdDuration"

const createPoliceDisposalsFromResult = (result: Result): PoliceDisposal[] => {
  const disposalByFirstAndSecondDurations = createPoliceDisposalByFirstAndSecondDurations(result)
  const disposalByThirdDuration = createPoliceDisposalByThirdDuration(result, disposalByFirstAndSecondDurations.text)

  return [disposalByFirstAndSecondDurations, ...(disposalByThirdDuration ? [disposalByThirdDuration] : [])]
}

export default createPoliceDisposalsFromResult
