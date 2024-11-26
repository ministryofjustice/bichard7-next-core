import type NormalDisposalPncUpdateRequest from "./NormalDisposalPncUpdateRequest"
import type RemandPncUpdateRequest from "./RemandPncUpdateRequest"

type PncUpdateRequest = RemandPncUpdateRequest | NormalDisposalPncUpdateRequest

export default PncUpdateRequest
