import type { PncOperation } from "../../../types/PncOperation"
import type PncUpdateRequest from "../../types/PncUpdateRequest"
import type PncUpdateRequestGenerator from "../../types/PncUpdateRequestGenerator"

const penaltyNoticeChargeGenerator: PncUpdateRequestGenerator<PncOperation.PENALTY_HEARING> = (
  _pncUpdateDataset,
  _operation
) => {
  // TODO: Implement PenaltyNoticeChargeMessageDispatcher.java:90
  return {} as PncUpdateRequest
}

export default penaltyNoticeChargeGenerator
