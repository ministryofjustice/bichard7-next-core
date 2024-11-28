export enum HearingDetailsType {
  ORDINARY = "ORDINARY",
  ADJUDICATION = "ADJUDICATION",
  DISPOSAL = "DISPOSAL",
  ARREST = "ARREST"
}

export type ArrestHearing = {
  committedOnBail: string
  courtOffenceSequenceNumber: string | null
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

export type CourtHearing = {
  courtOffenceSequenceNumber: string
  offenceReason: string
  type: HearingDetailsType.ORDINARY
}

export type Adjudication = {
  hearingDate: string
  numberOffencesTakenIntoAccount: string
  pleaStatus: string
  type: HearingDetailsType.ADJUDICATION
  verdict: string
}

export type Disposal = {
  disposalQualifiers: string
  disposalQuantity: string
  disposalText: string
  disposalType: string
  type: HearingDetailsType.DISPOSAL
}

export type ArrestHearingAdjudicationAndDisposal = ArrestHearing | Adjudication | Disposal
export type CourtHearingAdjudicationAndDisposal = CourtHearing | Adjudication | Disposal
export type CourtHearingAndDisposal = CourtHearing | Disposal
