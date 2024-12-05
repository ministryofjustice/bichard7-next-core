import type { ArrestHearingAdjudicationAndDisposal, CourtHearingAdjudicationAndDisposal } from "./HearingDetails"

type NormalDisposalPncUpdateRequest = {
  operation: "DISARR"
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
