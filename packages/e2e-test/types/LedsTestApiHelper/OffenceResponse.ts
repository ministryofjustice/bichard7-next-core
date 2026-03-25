type LocationAddress = {
  locationType: string
  locationText: string
}
type OffenceResponse = {
  id: string
  version: string
  arrestSummonsReference: string
  arrestChargeNumber: number
  chargeStatusMarker: string
  committedOnBail: boolean
  plea: string
  courtCaseReferenceNumber: string
  courtCaseChargeNumber: number
  forceStationChargeOrig: string
  crimeReference: string
  locationFSCode: string
  locationAddress: LocationAddress
  offencesTakenIntoConsideration: number
  adjudication: string
  othersCharged: string[]
  brcRecord: boolean
  hasDisposalResults: boolean
  additionalOffenceMarker: boolean
  npccOffenceCode: string
  cjsOffenceCode: string
  qualifiedCjsCode: string
  startDate: string
  roleQualifier: string[]
  legislationQualifier: string[]
}

export default OffenceResponse
