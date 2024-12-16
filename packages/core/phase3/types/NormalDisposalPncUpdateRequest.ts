import type { PncOperation } from "../../types/PncOperation"
import type { ArrestHearingAdjudicationAndDisposal, CourtHearingAdjudicationAndDisposal } from "./HearingDetails"

type NormalDisposalPncUpdateRequest = {
  operation: PncOperation.NORMAL_DISPOSAL
  request: {
    arrestsAdjudicationsAndDisposals: ArrestHearingAdjudicationAndDisposal[]
    arrestSummonsNumber: null | string
    courtCaseReferenceNumber: string
    courtHouseName: string
    croNumber: null | string
    dateOfHearing: string
    forceStationCode: string
    generatedPNCFilename: string
    hearingsAdjudicationsAndDisposals: CourtHearingAdjudicationAndDisposal[]
    pendingCourtDate: null | string
    pendingCourtHouseName: null | string
    pendingPsaCourtCode: null | string
    pncCheckName: null | string
    pncIdentifier: null | string
    preTrialIssuesUniqueReferenceNumber: null | string
    psaCourtCode: null | string
  }
}

export default NormalDisposalPncUpdateRequest
