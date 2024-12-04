import type { PncOperation } from "../../types/PncOperation"
import type { CourtHearingAndDisposal } from "./HearingDetails"

type SentenceDeferredPncUpdateRequest = {
  operation: PncOperation.SENTENCE_DEFERRED
  request: {
    courtCaseReferenceNumber: string
    courtCode: string
    croNumber: string | null
    forceStationCode: string
    hearingDate: string
    hearingDetails: CourtHearingAndDisposal[]
    hearingType: string
    pncCheckName: string | null
    pncIdentifier: string | null
  }
}

export default SentenceDeferredPncUpdateRequest
