import type { Offence } from "../../types/AnnotatedHearingOutcome"
import { PncOperation } from "../../types/PncOperation"
import type { PncUpdateDataset } from "../../types/PncUpdateDataset"

const hasCompletedDisarr = (pncUpdateDataset: PncUpdateDataset, offence: Offence) =>
  pncUpdateDataset.PncOperations.some(
    ({ code, status, data }) =>
      code === PncOperation.NORMAL_DISPOSAL &&
      status === "Completed" &&
      (!data?.courtCaseReference || data.courtCaseReference === offence.CourtCaseReferenceNumber)
  )

export default hasCompletedDisarr
