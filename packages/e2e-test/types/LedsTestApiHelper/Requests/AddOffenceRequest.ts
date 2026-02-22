export interface Content {
  committedOnBail: string
  ownerCode: string
  startDate: string
  startTime?: string
  locationFSCode: string
  roleQualifier?: null
  legislationQualifier?: null
  endDate?: string
  endTime?: string
  crimeReference: string
  offenceLocation: OffenceLocation
  offenceCode: OffenceCode
}

export interface OffenceCode {
  offenceCodeType: "cjs"
  cjsOffenceCode: string
}

export interface OffenceLocation {
  locationType: string
  locationText: string
}

export default interface AddOffenceRequest {
  content: Content
  changedBy: string
  checkname: string
}
