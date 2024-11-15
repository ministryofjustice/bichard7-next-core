import type { PncOperation } from "../../../types/PncOperation"
import type PncUpdateRequest from "../../types/PncUpdateRequest"
import type PncUpdateRequestGenerator from "../../types/PncUpdateRequestGenerator"

const disposalUpdateGenerator: PncUpdateRequestGenerator<PncOperation.DISPOSAL_UPDATED> = (
  _pncUpdateDataset,
  _operation
) => {
  // TODO: Implement DisposalUpdateMessageDispatcher.java:90
  return {} as PncUpdateRequest
}

export default disposalUpdateGenerator
