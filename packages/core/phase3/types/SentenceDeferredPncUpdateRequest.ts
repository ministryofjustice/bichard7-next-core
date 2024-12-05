import type { PncOperation } from "../../types/PncOperation"
import type { CourtHearingAndDisposal } from "./HearingDetails"

type SentenceDeferredPncUpdateRequest = {
  operation: PncOperation.SENTENCE_DEFERRED
  request: {
    courtCaseReferenceNumber: string
    courtCode: string
    croNumber: null | string
    forceStationCode: string
    hearingDate: string
    hearingDetails: CourtHearingAndDisposal[]
    hearingType: string
    pncCheckName: null | string
    pncIdentifier: null | string
  }
}

export default SentenceDeferredPncUpdateRequest
