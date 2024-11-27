import type NormalDisposalPncUpdateRequest from "./NormalDisposalPncUpdateRequest"
import type RemandPncUpdateRequest from "./RemandPncUpdateRequest"
import type SentenceDeferredPncUpdateRequest from "./SentenceDeferredPncUpdateRequest"

type PncUpdateRequest = RemandPncUpdateRequest | NormalDisposalPncUpdateRequest | SentenceDeferredPncUpdateRequest

export default PncUpdateRequest
