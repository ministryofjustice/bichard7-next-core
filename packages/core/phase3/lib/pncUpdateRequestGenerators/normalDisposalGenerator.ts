import type PncUpdateRequest from "../../types/PncUpdateRequest"
import type PncUpdateRequestGenerator from "../../types/PncUpdateRequestGenerator"

const normalDisposalGenerator: PncUpdateRequestGenerator = (_pncUpdateDataset, _operation) => {
  // TODO: Implement NormalDisposalGeneratorImpl.java:113
  return {} as PncUpdateRequest
}

export default normalDisposalGenerator
