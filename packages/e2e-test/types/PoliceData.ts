import type { CurrentAppearance, NextAppearance } from "@moj-bichard7/core/types/leds/RemandRequest"

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
  disposals: Disposal[]
}

export type Disposal = {
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

export type Case = {
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

export type Remand = {
  remandId: string
  appearanceResult: string
  remandDate: string
  currentAppearance: CurrentAppearance
  nextAppearance: Omit<NextAppearance, "forceStationCode">
}

type PoliceData = {
  cases: Case[]
  remands: Remand[]
}

export default PoliceData
