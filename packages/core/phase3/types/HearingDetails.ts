export enum PncUpdateType {
  ADJUDICATION = "ADJUDICATION",
  ARREST = "ARREST",
  DISPOSAL = "DISPOSAL",
  ORDINARY = "ORDINARY"
}

export type PncUpdateAdjudication = {
  hearingDate: string
  numberOffencesTakenIntoAccount: string
  pleaStatus: string
  type: PncUpdateType.ADJUDICATION
  verdict: string
}

export type PncUpdateArrestHearing = {
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
  type: PncUpdateType.ARREST
}

export type PncUpdateArrestHearingAdjudicationAndDisposal =
  | PncUpdateAdjudication
  | PncUpdateArrestHearing
  | PncUpdateDisposal

export type PncUpdateCourtHearing = {
  courtOffenceSequenceNumber: string
  offenceReason: string
  type: PncUpdateType.ORDINARY
}

export type PncUpdateCourtHearingAdjudicationAndDisposal =
  | PncUpdateAdjudication
  | PncUpdateCourtHearing
  | PncUpdateDisposal

export type PncUpdateCourtHearingAndDisposal = PncUpdateCourtHearing | PncUpdateDisposal

export type PncUpdateDisposal = {
  disposalQualifiers: string
  disposalQuantity: string
  disposalText: null | string
  disposalType: string
  type: PncUpdateType.DISPOSAL
}
