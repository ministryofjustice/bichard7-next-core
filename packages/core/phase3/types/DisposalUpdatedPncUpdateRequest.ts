import type { PncOperation } from "../../types/PncOperation"
import type { PncUpdateCourtHearingAdjudicationAndDisposal } from "./HearingDetails"

type DisposalUpdatedPncUpdateRequest = {
  operation: PncOperation.DISPOSAL_UPDATED
  request: {
    courtCaseReferenceNumber: string
    courtCode: string
    croNumber: null | string
    forceStationCode: string
    hearingDate: string
    hearingDetails: PncUpdateCourtHearingAdjudicationAndDisposal[]
    hearingType: string
    pncCheckName: null | string
    pncIdentifier: null | string
  }
}

export default DisposalUpdatedPncUpdateRequest
