import type NormalDisposalPncUpdateRequest from "./NormalDisposalPncUpdateRequest"
import type RemandPncUpdateRequest from "./RemandPncUpdateRequest"
import type SentenceDeferredPncUpdateRequest from "./SentenceDeferredPncUpdateRequest"
import type DisposalUpdatedPncUpdateRequest from "./DisposalUpdatedPncUpdateRequest"

type PncUpdateRequest =
  | RemandPncUpdateRequest
  | NormalDisposalPncUpdateRequest
  | SentenceDeferredPncUpdateRequest
  | DisposalUpdatedPncUpdateRequest

export default PncUpdateRequest
