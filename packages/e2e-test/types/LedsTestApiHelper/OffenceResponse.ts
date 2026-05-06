type LocationAddress = {
  locationType: string
  locationText: string
}

type OtherCharged = {
  chargeGroupDetailsId: string
  chargeGroupId: string
  checkName: string
  pncPersonId: string
  lastName: string
  firstNames: string[]
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
  othersCharged: OtherCharged[]
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
