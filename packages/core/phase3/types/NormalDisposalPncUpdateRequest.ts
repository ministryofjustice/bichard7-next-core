export enum HearingDetailsType {
  ORDINARY = "ORDINARY",
  ADJUDICATION = "ADJUDICATION",
  DISPOSAL = "DISPOSAL",
  ARREST = "ARREST"
}

export type HearingAdjudicationAndDisposal = {
  committedOnBail: string | null
  courtOffenceSequenceNumber: string | null
  disposalQualifiers: string | null
  disposalQuantity: string | null
  disposalText: string | null
  disposalType: string | null
  hearingDate: string | null
  locationOfOffence: string | null
  numberOffencesTakenIntoAccount: string | null
  offenceEndDate: string | null
  offenceEndTime: string | null
  offenceLocationFSCode: string | null
  offenceReason: string | null
  offenceReasonSequence: string | null
  offenceStartDate: string | null
  offenceStartTime: string | null
  pleaStatus: string | null
  type: HearingDetailsType
  verdict: string | null
}

type NormalDisposalPncUpdateRequest = {
  operation: "DISARR"
  request: {
    arrestSummonsNumber: string | null
    arrestsAdjudicationsAndDisposals: HearingAdjudicationAndDisposal[]
    courtCaseReferenceNumber: string
    courtHouseName: string
    croNumber: string | null
    dateOfHearing: string
    forceStationCode: string
    generatedPNCFilename: string
    hearingsAdjudicationsAndDisposals: HearingAdjudicationAndDisposal[]
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
