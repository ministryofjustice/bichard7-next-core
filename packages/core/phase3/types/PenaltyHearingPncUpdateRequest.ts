import type { PncOperation } from "../../types/PncOperation"
import type { CourtHearingAdjudicationAndDisposal } from "./HearingDetails"

type PenaltyHearingPncUpdateRequest = {
  operation: PncOperation.PENALTY_HEARING
  request: {
    courtCode: string
    croNumber: string | null
    forceStationCode: string
    hearingDate: string
    hearingDetails: CourtHearingAdjudicationAndDisposal[]
    hearingType: string
    penaltyNoticeCaseRef: string
    pncCheckName: string | null
    pncIdentifier: string | null
  }
}

export default PenaltyHearingPncUpdateRequest
