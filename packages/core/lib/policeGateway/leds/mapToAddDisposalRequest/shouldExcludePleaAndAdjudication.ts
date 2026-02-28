import type { DisposalResult } from "../../../../types/leds/AddDisposalRequest"

const CARRIED_FORWARD_CODE = 2059
const REFERRED_TO_COURT_CASE_CODE = 2060

const shouldExcludePleaAndAdjudication = (
  disposalResults: DisposalResult[],
  isCarriedForwardOrReferredToCourtCase: boolean
): boolean =>
  isCarriedForwardOrReferredToCourtCase &&
  disposalResults.some((d) => [CARRIED_FORWARD_CODE, REFERRED_TO_COURT_CASE_CODE].includes(d.disposalCode))

export default shouldExcludePleaAndAdjudication
