import type { Offence } from "@moj-bichard7/common/types/AnnotatedHearingOutcome"
import type { PncUpdateDataset } from "@moj-bichard7/common/types/PncUpdateDataset"

import { PncOperation } from "@moj-bichard7/common/types/PncOperation"

const hasCompletedDisposal = (pncUpdateDataset: PncUpdateDataset, offence: Offence) =>
  pncUpdateDataset.PncOperations.some(
    ({ code, status, data }) =>
      code === PncOperation.NORMAL_DISPOSAL &&
      status === "Completed" &&
      (!data?.courtCaseReference || data.courtCaseReference === offence.CourtCaseReferenceNumber)
  )

export default hasCompletedDisposal
