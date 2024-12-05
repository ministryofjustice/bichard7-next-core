export enum HearingDetailsType {
  ADJUDICATION = "ADJUDICATION",
  ARREST = "ARREST",
  DISPOSAL = "DISPOSAL",
  ORDINARY = "ORDINARY"
}

export type Adjudication = {
  hearingDate: string
  numberOffencesTakenIntoAccount: string
  pleaStatus: string
  type: HearingDetailsType.ADJUDICATION
  verdict: string
}

export type ArrestHearing = {
  committedOnBail: string
  courtOffenceSequenceNumber: null | string
  locationOfOffence: string
  offenceEndDate: string
  offenceEndTime: string
  offenceLocationFSCode: string
  offenceReason: string
  offenceReasonSequence: string
  offenceStartDate: string
  offenceStartTime: string
  type: HearingDetailsType.ARREST
}

export type ArrestHearingAdjudicationAndDisposal = Adjudication | ArrestHearing | Disposal

export type CourtHearing = {
  courtOffenceSequenceNumber: string
  offenceReason: string
  type: HearingDetailsType.ORDINARY
}

export type CourtHearingAdjudicationAndDisposal = Adjudication | CourtHearing | Disposal
export type CourtHearingAndDisposal = CourtHearing | Disposal
export type Disposal = {
  disposalQualifiers: string
  disposalQuantity: string
  disposalText: string
  disposalType: string
  type: HearingDetailsType.DISPOSAL
}
