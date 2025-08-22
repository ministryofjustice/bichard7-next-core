import type { PncOperation } from "@moj-bichard7/common/types/PncOperation"

import type {
  PncUpdateArrestHearingAdjudicationAndDisposal,
  PncUpdateCourtHearingAdjudicationAndDisposal
} from "./HearingDetails"

type NormalDisposalPncUpdateRequest = {
  operation: PncOperation.NORMAL_DISPOSAL
  request: {
    arrestsAdjudicationsAndDisposals: PncUpdateArrestHearingAdjudicationAndDisposal[]
    arrestSummonsNumber: null | string
    courtCaseReferenceNumber: string
    courtHouseName: string
    croNumber: null | string
    dateOfHearing: string
    forceStationCode: string
    generatedPNCFilename: string
    hearingsAdjudicationsAndDisposals: PncUpdateCourtHearingAdjudicationAndDisposal[]
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
