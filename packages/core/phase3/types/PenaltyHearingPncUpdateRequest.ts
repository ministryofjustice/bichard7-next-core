import type { PncOperation } from "@moj-bichard7/common/types/PncOperation"

import type { PncUpdateCourtHearingAdjudicationAndDisposal } from "./HearingDetails"

type PenaltyHearingPncUpdateRequest = {
  operation: PncOperation.PENALTY_HEARING
  request: {
    courtCode: string
    croNumber: null | string
    forceStationCode: string
    hearingDate: string
    hearingDetails: PncUpdateCourtHearingAdjudicationAndDisposal[]
    hearingType: string
    penaltyNoticeCaseRef: string
    pncCheckName: null | string
    pncIdentifier: null | string
  }
}

export default PenaltyHearingPncUpdateRequest
