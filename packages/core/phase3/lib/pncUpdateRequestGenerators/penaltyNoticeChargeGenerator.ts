import type PncUpdateRequest from "../../types/PncUpdateRequest"
import type PncUpdateRequestGenerator from "../../types/PncUpdateRequestGenerator"

const penaltyNoticeChargeGenerator: PncUpdateRequestGenerator = (_pncUpdateDataset, _operation) => {
  // TODO: Implement PenaltyNoticeChargeMessageDispatcher.java:90
  return {} as PncUpdateRequest
}

export default penaltyNoticeChargeGenerator
