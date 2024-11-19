export interface Report<T> {
  report: T[]
}

export interface ResolvedException {
  ASN: null | string
  caseReference: string
  courtName: string
  dateTimeRecievedByCJSE: string
  dateTimeResolved: string
  defendantName: null | string
  hearingDate: string
  notes: string[]
  PTIURN: string
  resolutionAction: string
}
