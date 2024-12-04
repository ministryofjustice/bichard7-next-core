import type { PncOperation } from "../../types/PncOperation"
import type { CourtHearingAdjudicationAndDisposal } from "./HearingDetails"

type PenaltyHearingPncUpdateRequest = {
  operation: PncOperation.PENALTY_HEARING
  request: {
    courtCode: string
    croNumber: null | string
    forceStationCode: string
    hearingDate: string
    hearingDetails: CourtHearingAdjudicationAndDisposal[]
    hearingType: string
    penaltyNoticeCaseRef: string
    pncCheckName: null | string
    pncIdentifier: null | string
  }
}

export default PenaltyHearingPncUpdateRequest
