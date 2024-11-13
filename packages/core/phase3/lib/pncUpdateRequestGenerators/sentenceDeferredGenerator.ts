import type PncUpdateRequest from "../../types/PncUpdateRequest"
import type PncUpdateRequestGenerator from "../../types/PncUpdateRequestGenerator"

const sentenceDeferredGenerator: PncUpdateRequestGenerator = (_pncUpdateDataset, _operation) => {
  // TODO: Implement SentenceDeferredGeneratorImpl.java:84
  return {} as PncUpdateRequest
}

export default sentenceDeferredGenerator
