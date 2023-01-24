import type { XML } from "./Xml"

export interface AhoXml {
  "?xml": XML
  "br7:AnnotatedHearingOutcome"?: Br7AnnotatedHearingOutcome
  "br7:HearingOutcome"?: Br7HearingOutcome
}

export interface Br7AnnotatedHearingOutcome {
  "br7:HearingOutcome": Br7HearingOutcome
  "br7:HasError"?: boolean
  CXE01: Cxe01 | undefined
  "br7:PNCQueryDate"?: Br7TextString
  "br7:PNCErrorMessage"?: {
    "#text": string
    "@_classification"?: string
  }
  "@_xmlns:ds": string
  "@_xmlns:xsi": string
  "@_xmlns:br7": string
}

export interface Cxe01 {
  FSC: Fsc
  IDS: IDS
  CourtCases?: CourtCases
  PenaltyCases?: PenaltyCases
}

export interface CourtCases {
  CourtCase?: CourtCase | CourtCase[]
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
  Offence: AhoXmlPncOffence[]
}

export interface AhoXmlPncOffence {
  COF: Cof
  ADJ?: Adj
  DISList?: DISList
}

export interface Adj {
  "@_Adjudication1": string
  "@_DateOfSentence": string
  "@_IntfcUpdateType": string
  "@_OffenceTICNumber": string
  "@_Plea": string
  "@_WeedFlag"?: string
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
  DIS: Dis[]
}

export interface Br7Duration {
  "ds:DurationType": Br7TextString
  "ds:DurationUnit": Br7TextString
  "ds:DurationLength": Br7TextString
}
export interface Dis {
  "@_IntfcUpdateType": string
  "@_QtyDate"?: string
  "@_QtyDuration"?: string
  "@_QtyMonetaryValue": string
  "@_QtyUnitsFined"?: string
  "@_Qualifiers"?: string
  "@_Text"?: string
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

export interface PCR {
  "@_IntfcUpdateType": string
  "@_PenaltyCaseRefNo": string
}

export interface PenaltyCase {
  PCR: PCR
  Offences: Offences
}

export interface PenaltyCases {
  PenaltyCase: PenaltyCase | PenaltyCase[]
}

export interface Br7HearingOutcome {
  "br7:Hearing": Br7Hearing
  "br7:Case": Br7Case
}

export interface Br7Case {
  "ds:PTIURN": Br7TextString
  "ds:CourtCaseReferenceNumber"?: Br7TextString
  "ds:PreChargeDecisionIndicator": Br7LiteralTextString
  "br7:CourtReference": Br7CourtReference
  "br7:PenaltyNoticeCaseReference"?: Br7TextString
  "br7:RecordableOnPNCindicator"?: Br7LiteralTextString
  "br7:Urgent"?: Br7Urgent
  "br7:ManualForceOwner"?: Br7TextString
  "br7:ForceOwner"?: Br7OrganisationUnit
  "br7:HearingDefendant": Br7HearingDefendant
  "@_hasError"?: boolean
  "@_SchemaVersion"?: string
}

export interface Br7Urgent {
  "br7:urgent": Br7LiteralTextString
  "br7:urgency": Br7TextString
}

export interface Br7CourtReference {
  "ds:MagistratesCourtReference": Br7TextString
}

export interface Br7HearingDefendant {
  "br7:ArrestSummonsNumber": Br7TextString
  "br7:PNCIdentifier"?: Br7TextString
  "br7:PNCCheckname"?: Br7TextString
  "br7:OrganisationName"?: Br7TextString
  "br7:DefendantDetail"?: Br7DefendantDetail
  "br7:Address": Br7Address
  "br7:RemandStatus": Br7LiteralTextString
  "br7:BailConditions"?: Br7TextString[]
  "br7:ReasonForBailConditions"?: Br7TextString
  "br7:CourtPNCIdentifier"?: Br7TextString
  "br7:Offence": Br7Offence[]
  "@_hasError"?: boolean
}

export interface Br7Address {
  "ds:AddressLine1": Br7TextString
  "ds:AddressLine2"?: Br7TextString
  "ds:AddressLine3"?: Br7TextString
  "ds:AddressLine4"?: Br7TextString
  "ds:AddressLine5"?: Br7TextString
}

export interface Br7DefendantDetail {
  "br7:PersonName": Br7PersonName
  "br7:GeneratedPNCFilename"?: Br7TextString
  "br7:BirthDate"?: Br7TextString
  "br7:Gender": Br7LiteralTextString
}

export interface Br7PersonName {
  "ds:Title"?: Br7TextString
  "ds:GivenName"?: Br7NameSequenceTextString | Br7NameSequenceTextString[]
  "ds:FamilyName": Br7NameSequenceTextString
}

export interface Br7AlcoholLevel {
  "ds:Amount": Br7TextString
  "ds:Method": Br7LiteralTextString
}

export interface Br7Offence {
  "ds:CriminalProsecutionReference": Br7CriminalProsecutionReference
  "ds:OffenceCategory"?: Br7LiteralTextString
  "ds:ArrestDate"?: Br7TextString
  "ds:ChargeDate"?: Br7TextString
  "ds:ActualOffenceDateCode": Br7LiteralTextString
  "ds:ActualOffenceStartDate": DsActualOffenceStartDate
  "ds:ActualOffenceEndDate"?: DsActualOffenceEndDate
  "ds:LocationOfOffence"?: Br7TextString
  "ds:OffenceTitle"?: Br7TextString
  "ds:ActualOffenceWording": Br7TextString
  "ds:RecordableOnPNCindicator"?: Br7LiteralTextString
  "ds:NotifiableToHOindicator"?: Br7LiteralTextString
  "ds:HomeOfficeClassification"?: Br7TextString
  "ds:AlcoholLevel"?: Br7AlcoholLevel
  "ds:ConvictionDate"?: Br7TextString
  "br7:CommittedOnBail": Br7LiteralTextString
  "br7:CourtOffenceSequenceNumber": Br7TextString
  "br7:AddedByTheCourt"?: Br7LiteralTextString
  "br7:ManualSequenceNo"?: Br7LiteralTextString
  "br7:ManualCourtCaseReference"?: Br7LiteralTextString
  "br7:CourtCaseReferenceNumber"?: Br7TextString
  "br7:Result": Br7Result | Br7Result[]
  "@_hasError"?: boolean
  "@_SchemaVersion"?: string
}
export interface Br7ResultQualifierVariable {
  "@_SchemaVersion": string
  "ds:Code": Br7TextString
}
export interface Br7Result {
  "ds:CJSresultCode": Br7TextString
  "ds:OffenceRemandStatus"?: Br7LiteralTextString
  "ds:SourceOrganisation": Br7OrganisationUnit
  "ds:CourtType"?: Br7TextString
  "ds:ResultHearingType"?: Br7LiteralTextString
  "ds:ResultHearingDate"?: Br7TextString
  "ds:DateSpecifiedInResult"?: Br7SequenceTextString[]
  "ds:NumberSpecifiedInResult"?: Br7TypeTextString[]
  "ds:Duration"?: Br7Duration[]
  "ds:NextResultSourceOrganisation"?: Br7OrganisationUnit
  "ds:NextCourtType"?: Br7TextString
  "ds:NextHearingDate"?: Br7TextString
  "ds:NextHearingTime"?: Br7TextString
  "ds:BailCondition"?: Br7TextString[]
  "ds:AmountSpecifiedInResult"?: Br7TypeTextString[]
  "ds:PleaStatus"?: Br7LiteralTextString
  "ds:Verdict"?: Br7LiteralTextString
  "ds:ModeOfTrialReason"?: Br7LiteralTextString
  "ds:ResultVariableText"?: Br7TextString
  "ds:WarrantIssueDate"?: Br7TextString
  "ds:ResultHalfLifeHours"?: Br7TextString
  "br7:PNCDisposalType"?: Br7TextString
  "br7:ResultClass"?: Br7TextString
  "br7:ReasonForOffenceBailConditions"?: Br7TextString
  "br7:Urgent"?: Br7Urgent
  "br7:PNCAdjudicationExists"?: Br7LiteralTextString
  "br7:NumberOfOffencesTIC"?: Br7TextString
  "br7:ResultQualifierVariable"?: Br7ResultQualifierVariable[]
  "br7:ConvictingCourt"?: Br7TextString
  "@_hasError"?: boolean
  "@_SchemaVersion"?: string
}

export interface Br7OrganisationUnit {
  "ds:TopLevelCode"?: Br7TextString
  "ds:SecondLevelCode": Br7TextString
  "ds:ThirdLevelCode": Br7TextString
  "ds:BottomLevelCode": Br7TextString
  "ds:OrganisationUnitCode": Br7TextString
  "@_SchemaVersion": string
}

export interface DsActualOffenceEndDate {
  "ds:EndDate"?: Br7TextString
}

export interface DsActualOffenceStartDate {
  "ds:StartDate": Br7TextString
}

export interface Br7CriminalProsecutionReference {
  "ds:DefendantOrOffender": DsDefendantOrOffender
  "ds:OffenceReason"?: Br7OffenceReason
  "ds:OffenceReasonSequence"?: Br7ErrorString
  "@_SchemaVersion": string
}

export interface DsDefendantOrOffender {
  "ds:Year"?: Br7TextString
  "ds:OrganisationUnitIdentifierCode": Br7OrganisationUnit
  "ds:DefendantOrOffenderSequenceNumber"?: Br7TextString
  "ds:CheckDigit"?: Br7TextString
}

export interface Br7OffenceReason {
  "ds:OffenceCode"?: NonMatchingOffenceCode | CommonLawOffenceCode | IndictmentOffenceCode
  "ds:LocalOffenceCode"?: DsLocalOffenceCode
}

export interface NonMatchingOffenceCode {
  "ds:ActOrSource": Br7TextString
  "ds:Year"?: Br7TextString
  "ds:Reason": Br7TextString
  "ds:Qualifier"?: Br7TextString
}

export interface CommonLawOffenceCode {
  "ds:CommonLawOffence": Br7TextString
  "ds:Reason": Br7TextString
  "ds:Qualifier"?: Br7TextString
}

export interface IndictmentOffenceCode {
  "ds:Reason": Br7TextString
  "ds:Qualifier"?: Br7TextString
}

export interface DsLocalOffenceCode {
  "ds:AreaCode": Br7TextString
  "ds:OffenceCode": Br7TextString
}

export interface Br7Hearing {
  "ds:CourtHearingLocation": Br7OrganisationUnit
  "ds:DateOfHearing": Br7TextString
  "ds:TimeOfHearing": Br7TextString
  "ds:HearingLanguage": Br7LiteralTextString
  "ds:HearingDocumentationLanguage": Br7LiteralTextString
  "ds:DefendantPresentAtHearing": Br7LiteralTextString
  "br7:SourceReference": Br7SourceReference
  "br7:CourtType"?: Br7LiteralTextString
  "br7:CourtHouseCode": Br7TextString
  "br7:CourtHouseName"?: Br7TextString
  "@_hasError"?: boolean
  "@_SchemaVersion"?: string
}

export interface Br7SourceReference {
  "br7:DocumentName": Br7TextString
  "br7:UniqueID": Br7TextString
  "br7:DocumentType": Br7TextString
}

export interface Br7ErrorString {
  "#text"?: string
  "@_Error"?: string
}

export interface Br7TextString {
  "#text": string
  "@_Error"?: string
}
export interface Br7LiteralTextString extends Br7TextString {
  "@_Literal"?: string
}

export interface Br7TypeTextString extends Br7TextString {
  "@_Type": string
}

export interface Br7SequenceTextString extends Br7TextString {
  "@_Sequence": string
}

export interface Br7NameSequenceTextString extends Br7TextString {
  "@_NameSequence": string
}

export type GenericAhoXmlValue = GenericAhoXml | GenericAhoXml[] | Br7TextString | Br7TextString[] | string

export type GenericAhoXml = {
  [key: string]: GenericAhoXmlValue
}
