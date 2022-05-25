export type AhoParsedXml = {
  "?xml": XML
  AnnotatedHearingOutcome: AnnotatedHearingOutcome
}

export interface XML {
  "@_version": string
  "@_encoding": string
  "@_standalone": string
}

export interface AnnotatedHearingOutcome {
  HearingOutcome: HearingOutcome
  HasError: boolean
  CXE01: Cxe01
  PNCQueryDate: Date
}

export interface Cxe01 {
  FSC: Fsc
  IDS: IDS
  CourtCases: CourtCases
}

export interface CourtCases {
  CourtCase: CourtCase
}

export interface CourtCase {
  CCR: Ccr
  Offences: Offences
}

export interface Ccr {
  "@_CourtCaseRefNo": string
  "@_CrimeOffenceRefNo": string
  "@_IntfcUpdateType": string
}

export interface Offences {
  Offence: OffencesOffence[]
}

export interface OffencesOffence {
  COF: Cof
  ADJ: Adj
  DISList: DISList
}

export interface Adj {
  "@_Adjudication1": string
  "@_DateOfSentence": string
  "@_IntfcUpdateType": string
  "@_OffenceTICNumber": string
  "@_Plea": string
  "@_WeedFlag": string
}

export interface Cof {
  "@_ACPOOffenceCode": string
  "@_CJSOffenceCode": string
  "@_IntfcUpdateType": string
  "@_OffEndDate": string
  "@_OffEndTime": string
  "@_OffStartDate": string
  "@_OffStartTime": string
  "@_OffenceQualifier1": string
  "@_OffenceQualifier2": string
  "@_OffenceTitle": string
  "@_ReferenceNumber": string
}

export interface DISList {
  DIS: Dis
}

export interface Dis {
  "@_IntfcUpdateType": string
  "@_QtyDate": string
  "@_QtyDuration": string
  "@_QtyMonetaryValue": string
  "@_QtyUnitsFined": string
  "@_Qualifiers": string
  "@_Text": string
  "@_Type": string
}

export interface Fsc {
  "@_FSCode": string
  "@_IntfcUpdateType": string
}

export interface IDS {
  "@_CRONumber": string
  "@_Checkname": string
  "@_IntfcUpdateType": string
  "@_PNCID": string
}

export interface HearingOutcome {
  Hearing: Hearing
  Case: Case
}

export interface Case {
  PTIURN: string
  PreChargeDecisionIndicator: PreChargeDecisionIndicator
  CourtReference: CourtReference
  RecordableOnPNCindicator: PreChargeDecisionIndicator
  ForceOwner: ForceOwner
  HearingDefendant: HearingDefendant
  "@_hasError": string
  "@_SchemaVersion": string
}

export interface CourtReference {
  MagistratesCourtReference: string
}

export interface ForceOwner {
  SecondLevelCode: number
  ThirdLevelCode: number
  BottomLevelCode: number
  OrganisationUnitCode: number
  "@_SchemaVersion": string
}

export interface HearingDefendant {
  ArrestSummonsNumber: ArrestSummonsNumber
  DefendantDetail: DefendantDetail
  Address: Address
  RemandStatus: PreChargeDecisionIndicator
  CourtPNCIdentifier: string
  Offence: HearingDefendantOffence[]
  "@_hasError": string
}

export interface Address {
  AddressLine1: string
  AddressLine2: string
  AddressLine3: string
}

export interface ArrestSummonsNumber {
  "#text": string
  "@_Error": string
}

export interface DefendantDetail {
  PersonName: PersonName
  GeneratedPNCFilename: string
  BirthDate: Date
  Gender: Gender
}

export interface Gender {
  "#text": number
  "@_Literal": string
}

export interface PersonName {
  Title: string
  GivenName: Name
  FamilyName: Name
}

export interface Name {
  "#text": string
  "@_NameSequence": string
}

export interface HearingDefendantOffence {
  CriminalProsecutionReference: CriminalProsecutionReference
  OffenceCategory: PreChargeDecisionIndicator
  ArrestDate: Date
  ChargeDate: Date
  ActualOffenceDateCode: Gender
  ActualOffenceStartDate: ActualOffenceStartDate
  ActualOffenceEndDate: ActualOffenceEndDate
  LocationOfOffence: string
  OffenceTitle: string
  ActualOffenceWording: string
  RecordableOnPNCindicator: PreChargeDecisionIndicator
  NotifiableToHOindicator: PreChargeDecisionIndicator
  HomeOfficeClassification: string
  ConvictionDate: Date
  CommittedOnBail: PreChargeDecisionIndicator
  CourtOffenceSequenceNumber: number
  AddedByTheCourt: PreChargeDecisionIndicator
  Result: Result
  "@_hasError": string
  "@_SchemaVersion": string
}

export interface ActualOffenceEndDate {
  EndDate: Date
}

export interface ActualOffenceStartDate {
  StartDate: Date
}

export interface PreChargeDecisionIndicator {
  "#text": string
  "@_Literal": string
}

export interface CriminalProsecutionReference {
  DefendantOrOffender: DefendantOrOffender
  OffenceReason: OffenceReason
  "@_SchemaVersion": string
}

export interface DefendantOrOffender {
  Year: number
  OrganisationUnitIdentifierCode: CourtHearingLocation
  DefendantOrOffenderSequenceNumber: number
  CheckDigit: string
}

export interface CourtHearingLocation {
  SecondLevelCode: string
  ThirdLevelCode: string
  BottomLevelCode: string
  OrganisationUnitCode: string
  "@_SchemaVersion": string
  TopLevelCode?: string
}

export interface OffenceReason {
  OffenceCode: OffenceCode
}

export interface OffenceCode {
  ActOrSource: string
  Year: number
  Reason: number
}

export interface Result {
  CJSresultCode: number
  SourceOrganisation: CourtHearingLocation
  CourtType: string
  ResultHearingType: PreChargeDecisionIndicator
  ResultHearingDate: Date
  PleaStatus: PreChargeDecisionIndicator
  ModeOfTrialReason: PreChargeDecisionIndicator
  ResultVariableText: string
  ResultHalfLifeHours: number
  PNCDisposalType: number
  ResultClass: string
  ConvictingCourt: number
  "@_hasError": string
  "@_SchemaVersion": string
}

export interface Hearing {
  CourtHearingLocation: CourtHearingLocation
  DateOfHearing: Date
  TimeOfHearing: string
  HearingLanguage: PreChargeDecisionIndicator
  HearingDocumentationLanguage: PreChargeDecisionIndicator
  DefendantPresentAtHearing: PreChargeDecisionIndicator
  SourceReference: SourceReference
  CourtType: PreChargeDecisionIndicator
  CourtHouseCode: number
  CourtHouseName: string
  "@_hasError": string
  "@_SchemaVersion": string
}

export interface SourceReference {
  DocumentName: string
  UniqueID: string
  DocumentType: string
}
