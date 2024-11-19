import type { Offence } from "../../types/AnnotatedHearingOutcome"
import type { PncUpdateDataset } from "../../types/PncUpdateDataset"

import { PncOperation } from "../../types/PncOperation"

const hasCompletedDisposal = (pncUpdateDataset: PncUpdateDataset, offence: Offence) =>
  pncUpdateDataset.PncOperations.some(
    ({ code, data, status }) =>
      code === PncOperation.NORMAL_DISPOSAL &&
      status === "Completed" &&
      (!data?.courtCaseReference || data.courtCaseReference === offence.CourtCaseReferenceNumber)
  )

export default hasCompletedDisposal
