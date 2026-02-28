type Charge = {
  offenceId: string
  arrestSummonsId: string
  adjudication?: string
  npccOffenceCode: string
  cjsOffenceCode: string
  qualifiedCjsCode: string
  offenceDescription: string[]
  offenceRoleQualifiers: string[]
  offenceLegislationQualifiers: string[]
  offenceChargeNumber: number
  additionalMarker: boolean
  disposals: Disposal[]
}

type Disposal = {
  id: string
  disposalCode: string
  disposalQualifierCodes: string[]
  fineAmount?: number
  disposalDuration?: DisposalDuration
}

type DisposalDuration = {
  units: string
  count: number
}

type Court = {
  courtIdentityType: string
  courtName: string
}

type Pagination = {
  recordTotal: number
  offset: number
  limit: number
}

type Entry = {
  id: string
  court?: Court
  convictionDate: string
  courtCaseReference: string
  caseStatusMarker: string
  charges: Charge[]
  subsequentAppearances?: string[]
  owner?: string
  userReference?: string
}

type DisposalHistoryResponse = {
  pagination: Pagination
  entries: Entry[]
}

export default DisposalHistoryResponse
