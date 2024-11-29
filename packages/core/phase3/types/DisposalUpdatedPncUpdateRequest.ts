import type { PncOperation } from "../../types/PncOperation"
import type { CourtHearingAdjudicationAndDisposal } from "./HearingDetails"

type DisposalUpdatedPncUpdateRequest = {
  operation: PncOperation.DISPOSAL_UPDATED
  request: {
    courtCaseReferenceNumber: string
    courtCode: string
    croNumber: string | null
    forceStationCode: string
    hearingDate: string
    hearingDetails: CourtHearingAdjudicationAndDisposal[]
    hearingType: string
    pncCheckName: string | null
    pncIdentifier: string | null
  }
}

export default DisposalUpdatedPncUpdateRequest
