import type { ArrestHearingAdjudicationAndDisposal, CourtHearingAdjudicationAndDisposal } from "./HearingDetails"

type NormalDisposalPncUpdateRequest = {
  operation: "DISARR"
  request: {
    arrestSummonsNumber: string | null
    arrestsAdjudicationsAndDisposals: ArrestHearingAdjudicationAndDisposal[]
    courtCaseReferenceNumber: string
    courtHouseName: string
    croNumber: string | null
    dateOfHearing: string
    forceStationCode: string
    generatedPNCFilename: string
    hearingsAdjudicationsAndDisposals: CourtHearingAdjudicationAndDisposal[]
    pendingCourtDate: string | null
    pendingCourtHouseName: string | null
    pendingPsaCourtCode: string | null
    pncCheckName: string | null
    pncIdentifier: string | null
    preTrialIssuesUniqueReferenceNumber: string | null
    psaCourtCode: string | null
  }
}

export default NormalDisposalPncUpdateRequest
