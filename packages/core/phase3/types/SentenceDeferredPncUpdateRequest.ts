import type { PncOperation } from "../../types/PncOperation"
import type { PncUpdateCourtHearingAndDisposal } from "./HearingDetails"

type SentenceDeferredPncUpdateRequest = {
  operation: PncOperation.SENTENCE_DEFERRED
  request: {
    courtCaseReferenceNumber: string
    courtCode: string
    croNumber: null | string
    forceStationCode: string
    hearingDate: string
    hearingDetails: PncUpdateCourtHearingAndDisposal[]
    hearingType: string
    pncCheckName: null | string
    pncIdentifier: null | string
  }
}

export default SentenceDeferredPncUpdateRequest
