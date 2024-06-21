import type { Offence } from "../../types/AnnotatedHearingOutcome"
import type { PncUpdateDataset } from "../../types/PncUpdateDataset"

const hasCompletedDisarr = (pncUpdateDataset: PncUpdateDataset, offence: Offence) =>
  pncUpdateDataset.PncOperations.some(
    ({ code, status, data }) =>
      code === "DISARR" &&
      status === "Completed" &&
      (!data?.courtCaseReference || data.courtCaseReference === offence.CourtCaseReferenceNumber)
  )

export default hasCompletedDisarr
