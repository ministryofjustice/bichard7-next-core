import type AddOffenceRequest from "./AddOffenceRequest"

export interface ArrestReport {
  fsCodeMakingChange: string
  content: Content
  checkname: string
}

export interface Content {
  arrestFirstNames: string[]
  arrestLastName: string
  arrestDob: string
  processStage: string
  processStageDate: string
  processStageTime?: null
  ownerCode: string
  prosecutingAgent: string
  arrestingOfficer: ArrestingOfficer
  photoAvailable: boolean
  dateOfPhoto?: null
  photoForceLocation?: null
  fingerprintStatusGroup: FingerprintStatusGroup
  dnaStatusCode: string
  dnaLaboratory?: null
  dnaForceLocation?: null
  sampleBarcode?: null
  dnaSampleDate?: null
  dnaSampleType?: null
  forceDNAReferencePrefix?: null
  forceDnaReferenceId?: null
  offence: AddOffenceRequest["content"]
  caseDetailText: string[]
}

export interface FingerprintStatusGroup {
  statusCode: string
  forceLocation: null
}

export interface ArrestingOfficer {
  division: string
  lastName: string
  rankCode: string
  number: number
}

export interface Person {
  lastName: string
  firstNames: string[]
  dateOfBirth: string
  sex: string
  skinColour?: null
  heightType?: null
  metricHeight?: null
  heightInFeet?: null
  heightInInches?: null
}

export default interface CreateArrestedPersonRequest {
  person: Person
  arrestReport: ArrestReport
}
