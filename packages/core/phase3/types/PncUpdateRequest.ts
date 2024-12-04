import type DisposalUpdatedPncUpdateRequest from "./DisposalUpdatedPncUpdateRequest"
import type NormalDisposalPncUpdateRequest from "./NormalDisposalPncUpdateRequest"
import type PenaltyHearingPncUpdateRequest from "./PenaltyHearingPncUpdateRequest"
import type RemandPncUpdateRequest from "./RemandPncUpdateRequest"
import type SentenceDeferredPncUpdateRequest from "./SentenceDeferredPncUpdateRequest"

type PncUpdateRequest =
  | DisposalUpdatedPncUpdateRequest
  | NormalDisposalPncUpdateRequest
  | PenaltyHearingPncUpdateRequest
  | RemandPncUpdateRequest
  | SentenceDeferredPncUpdateRequest

export default PncUpdateRequest
