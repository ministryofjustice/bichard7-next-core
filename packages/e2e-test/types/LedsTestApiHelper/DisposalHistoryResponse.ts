import type OffenceResponse from "./OffenceResponse"

export type Charge = {
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
  offence?: OffenceResponse
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

export type SubsequentAppearance = {
  appearanceNumber: number
  court: Court
  sentenceDate: string
  reasonForVariation: string
  charges: Charge[]
}

type Pagination = {
  recordTotal: number
  offset: number
  limit: number
}

export type DisposalEntry = {
  id: string
  court?: Court
  convictionDate: string
  courtCaseReference: string
  caseStatusMarker: string
  charges: Charge[]
  subsequentAppearances?: SubsequentAppearance[]
  owner?: string
  userReference?: string
}

type DisposalHistoryResponse = {
  pagination: Pagination
  entries: DisposalEntry[]
}

export default DisposalHistoryResponse
