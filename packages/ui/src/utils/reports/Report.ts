export interface Report<T> {
  report: T[]
}

export interface ResolvedException {
  ASN: string | null
  PTIURN: string
  defendantName: string | null
  courtName: string
  hearingDate: string
  caseReference: string
  dateTimeRecievedByCJSE: string
  dateTimeResolved: string
  notes: string[]
  resolutionAction: string
}
