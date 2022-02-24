import type {
  StringElementWithError,
  StringElement,
  ErrorAttribute,
  HasErrorAttribute,
  LiteralAttribute,
  NameSequenceAttribute,
  NumberElementWithError
} from "./XmlElement"

export interface HearingOutcome {
  Hearing: Hearing
  Case: Case
}

export interface Case {
  attributes?: HasErrorAttribute
  PTIURN: StringElementWithError
  CaseMarker?: StringElementWithError
  CPSOrganisation?: OrganisationUnit
  PreChargeDecisionIndicator: StringElement<ErrorAttribute & LiteralAttribute>
  CourtReference: CourtReference
  CourtOfAppealResult?: StringElementWithError
  ForceOwner?: ForceOwner
  RecordableOnPNCindicator?: StringElement<LiteralAttribute>
  HearingDefendant?: HearingDefendant
}

interface ForceOwner {
  SecondLevelCode: string
  ThirdLevelCode: string
  BottomLevelCode: string
  OrganisationUnitCode: string
}

export interface HearingDefendant {
  attributes: HasErrorAttribute
  ArrestSummonsNumber: StringElementWithError
  DriverNumber: StringElementWithError
  CRONumber: string
  PNCIdentifier: string
  PNCCheckname: string
  DefendantDetail: DefendantDetail
  Address?: Address
  RemandStatus: StringElement<ErrorAttribute & LiteralAttribute>
  BailConditions: StringElementWithError[]
  ReasonForBailConditions: StringElementWithError
  CourtPNCIdentifier: StringElementWithError
  OrganisationName: StringElementWithError
  Offence: Offence[]
  Result: Result
}

export interface Offence {
  attributes: HasErrorAttribute
  CriminalProsecutionReference: CriminalProsecutionReference
  OffenceInitiationCode: StringElementWithError
  SummonsCode: StringElementWithError
  Informant: StringElementWithError
  ArrestDate: StringElementWithError
  ChargeDate: StringElementWithError
  ActualOffenceDateCode: StringElementWithError
  ActualOffenceStartDate: ActualOffenceStartDate
  ActualOffenceEndDate: ActualOffenceEndDate
  LocationOfOffence: StringElementWithError
  OffenceWelshTitle: StringElementWithError
  ActualOffenceWording: StringElementWithError
  ActualWelshOffenceWording: StringElementWithError
  ActualIndictmentWording: StringElementWithError
  ActualWelshIndictmentWording: StringElementWithError
  ActualStatementOfFacts: StringElementWithError
  ActualWelshStatementOfFacts: StringElementWithError
  AlcoholLevel: AlcoholLevel
  VehicleCode: StringElementWithError
  VehicleRegistrationMark: StringElementWithError
  StartTime: StringElementWithError
  OffenceEndTime: StringElementWithError
  ConvictionDate: StringElementWithError
  CommittedOnBail: StringElementWithError
  CourtOffenceSequenceNumber: StringElementWithError
  Result: Result
}

interface AlcoholLevel {
  Amount: StringElementWithError
  Method: StringElementWithError
}

interface ActualOffenceEndDate {
  EndDate: StringElementWithError
}

interface ActualOffenceStartDate {
  StartDate: StringElementWithError
}

interface CriminalProsecutionReference {
  DefendantOrOffender?: DefendantOrOffender[]
  OffenceReason: OffenceReason
}

interface DefendantOrOffender {
  Year: string
  OrganisationUnitIdentifierCode: OrganisationUnitIdentifierCode
  DefendantOrOffenderSequenceNumber: string
  CheckDigit: string
}

interface OrganisationUnitIdentifierCode {
  SecondLevelCode: string
  ThirdLevelCode: string
  BottomLevelCode: string
  OrganisationUnitCode: StringElementWithError
}

export interface OffenceReason {
  LocalOffenceCode?: LocalOffenceCode
  OffenceCode: OffenceCode
}

export interface OffenceCode {
  Indictment: string
  CommonLawOffence: string
  ActOrSource: StringElementWithError
  Year: StringElementWithError
  Reason: StringElementWithError
  Qualifier: StringElementWithError
}

interface LocalOffenceCode {
  AreaCode: StringElementWithError
  OffenceCode: StringElementWithError
}

interface Result {
  attributes: HasErrorAttribute
  CJSresultCode: StringElementWithError
  OffenceRemandStatus: StringElementWithError
  SourceOrganisation: OrganisationUnit
  CourtType: StringElement<ErrorAttribute & LiteralAttribute>
  ResultHearingType: StringElement<ErrorAttribute & LiteralAttribute>
  ResultHearingDate: StringElementWithError
  Duration: Duration
  DateSpecifiedInResult: StringElementWithError
  TimeSpecifiedInResult: StringElementWithError
  AmountSpecifiedInResult: StringElementWithError
  NumberSpecifiedInResult: StringElementWithError
  NextResultSourceOrganisation: OrganisationUnit
  NextHearingType: StringElementWithError
  NextHearingDate: StringElementWithError
  NextHearingTime: StringElementWithError
  NextCourtType: StringElementWithError
  PleaStatus: StringElement<ErrorAttribute & LiteralAttribute>
  Verdict: StringElementWithError
  ResultVariableText: StringElementWithError
  TargetCourtType: StringElementWithError
  WarrantIssueDate: StringElementWithError
  CRESTDisposalCode: StringElementWithError
  ModeOfTrialReason: StringElementWithError
  RecordableOnPNCindicator: StringElement<LiteralAttribute>
  PNCDisposalType: StringElementWithError
  ResultClass: StringElementWithError
  NumberOfOffencesTIC: StringElementWithError
  ReasonForOffenceBailConditions: StringElementWithError
  ResultQualifierVariable: ResultQualifierVariable
}

interface Duration {
  DurationType: StringElementWithError
  DurationUnit: StringElementWithError
  DurationLength: StringElementWithError
}

interface ResultQualifierVariable {
  Code: StringElementWithError
  Duration: Duration
  DateSpecifiedInResult: StringElementWithError
  Text: StringElementWithError
}

export interface Address {
  AddressLine1: StringElementWithError
  AddressLine2: StringElementWithError
  AddressLine3: StringElementWithError
  AddressLine4: StringElementWithError
  AddressLine5: StringElementWithError
  UKpostcode?: StringElementWithError
  Country?: StringElementWithError
}

export interface DefendantDetail {
  PersonName: PersonName
  GeneratedPNCFilename?: string
  BirthDate: StringElementWithError
  Gender: StringElement<LiteralAttribute>
}

interface PersonName {
  Title: StringElementWithError
  GivenName: StringElement<NameSequenceAttribute>[]
  RequestedName?: StringElementWithError
  FamilyName: StringElement<NameSequenceAttribute>
  Suffix?: StringElementWithError
}

interface CourtReference {
  CrownCourtReference?: StringElementWithError
  MagistratesCourtReference?: StringElementWithError
}

export interface Hearing {
  attributes?: HasErrorAttribute
  CourtHearingLocation: OrganisationUnit
  DateOfHearing: StringElementWithError
  TimeOfHearing: StringElementWithError
  HearingLanguage: StringElement<ErrorAttribute & LiteralAttribute>
  HearingDocumentationLanguage: StringElement<ErrorAttribute & LiteralAttribute>
  DefendantPresentAtHearing: StringElement<ErrorAttribute & LiteralAttribute>
  ReportRequestedDate: StringElementWithError
  ReportCompletedDate: StringElementWithError
  SourceReference: SourceReference
  CourtType: StringElement<ErrorAttribute & LiteralAttribute>
  CourtHouseCode: NumberElementWithError
  CourtHouseName: StringElementWithError
}

interface SourceReference {
  DocumentName: StringElementWithError
  UniqueID: StringElementWithError
  DocumentType: StringElementWithError
  TimeStamp?: StringElementWithError
  Version?: StringElementWithError
  SecurityClassification?: StringElementWithError
  SellByDate?: StringElementWithError
  XSLstylesheetURL?: StringElementWithError
}

interface OrganisationUnit {
  TopLevelCode: string
  SecondLevelCode: string
  ThirdLevelCode: string
  BottomLevelCode: string
  OrganisationUnitCode: StringElementWithError
}
