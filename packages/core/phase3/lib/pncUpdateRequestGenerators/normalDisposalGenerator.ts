import type { PncOperation } from "../../../types/PncOperation"
import type PncUpdateRequest from "../../types/PncUpdateRequest"
import type PncUpdateRequestGenerator from "../../types/PncUpdateRequestGenerator"

const normalDisposalGenerator: PncUpdateRequestGenerator<PncOperation.NORMAL_DISPOSAL> = (
  _pncUpdateDataset,
  _operation
) => {
  // TODO: Implement NormalDisposalMessageDispatcher.java:113
  return {} as PncUpdateRequest
}

export default normalDisposalGenerator
