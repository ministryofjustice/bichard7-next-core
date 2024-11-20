import type { XML } from "@moj-bichard7/common/types/Xml"

export type AhoXml = {
  "?xml"?: XML
  "br7:AnnotatedHearingOutcome"?: Br7AnnotatedHearingOutcome
  "br7:HearingOutcome"?: Br7HearingOutcome
}

export interface Br7AnnotatedHearingOutcome {
  "@_xmlns:br7": string
  "@_xmlns:ds"?: string
  "@_xmlns:xsi"?: string
  "br7:HasError"?: Br7TextString
  "br7:HearingOutcome": Br7HearingOutcome
  "br7:PNCErrorMessage"?: {
    "#text": string
    "@_classification"?: string
  }
  "br7:PNCQueryDate"?: Br7TextString
  CXE01: Cxe01 | undefined
}

export interface Cxe01 {
  "@_xmlns"?: string
  CourtCases?: CourtCases
  FSC: Fsc
  IDS: IDS
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
  ADJ?: Adj
  COF: Cof
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
  "@_OffenceQualifier1": string
  "@_OffenceQualifier2": string
  "@_OffenceTitle": string
  "@_OffEndDate": string
  "@_OffEndTime": string
  "@_OffStartDate": string
  "@_OffStartTime": string
  "@_ReferenceNumber": string
}

export interface DISList {
  DIS: Dis[]
}

export interface Br7Duration {
  "ds:DurationLength": Br7TextString
  "ds:DurationType": Br7TextString
  "ds:DurationUnit": Br7TextString
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
  "@_Checkname": string
  "@_CRONumber": string
  "@_IntfcUpdateType": string
  "@_PNCID": string
}

export interface PCR {
  "@_IntfcUpdateType": string
  "@_PenaltyCaseRefNo": string
}

export interface PenaltyCase {
  Offences: Offences
  PCR: PCR
}

export interface PenaltyCases {
  PenaltyCase: PenaltyCase | PenaltyCase[]
}

export interface Br7HearingOutcome {
  "br7:Case": Br7Case
  "br7:Hearing": Br7Hearing
}

export interface Br7Case {
  "@_hasError"?: boolean
  "@_SchemaVersion"?: string
  "br7:CourtReference": Br7CourtReference
  "br7:ForceOwner"?: Br7OrganisationUnit
  "br7:HearingDefendant": Br7HearingDefendant
  "br7:ManualForceOwner"?: Br7TextString
  "br7:PenaltyNoticeCaseReference"?: Br7TextString
  "br7:RecordableOnPNCindicator"?: Br7LiteralTextString
  "br7:Urgent"?: Br7Urgent
  "ds:CourtCaseReferenceNumber"?: Br7TextString
  "ds:PreChargeDecisionIndicator": Br7LiteralTextString
  "ds:PTIURN": Br7TextString
}

export interface Br7Urgent {
  "br7:urgency": Br7TextString
  "br7:urgent": Br7LiteralTextString
}

export interface Br7CourtReference {
  "ds:MagistratesCourtReference": Br7TextString
}

export interface Br7HearingDefendant {
  "@_hasError"?: boolean
  "br7:Address": Br7Address
  "br7:ArrestSummonsNumber": Br7TextString
  "br7:BailConditions"?: Br7TextString[]
  "br7:CourtPNCIdentifier"?: Br7TextString
  "br7:DefendantDetail"?: Br7DefendantDetail
  "br7:Offence": Br7Offence[]
  "br7:OrganisationName"?: Br7TextString
  "br7:PNCCheckname"?: Br7TextString
  "br7:PNCIdentifier"?: Br7TextString
  "br7:ReasonForBailConditions"?: Br7TextString
  "br7:RemandStatus": Br7LiteralTextString
}

export interface Br7Address {
  "ds:AddressLine1": Br7TextString
  "ds:AddressLine2"?: Br7TextString
  "ds:AddressLine3"?: Br7TextString
  "ds:AddressLine4"?: Br7TextString
  "ds:AddressLine5"?: Br7TextString
}

export interface Br7DefendantDetail {
  "br7:BirthDate"?: Br7TextString
  "br7:Gender": Br7LiteralTextString
  "br7:GeneratedPNCFilename"?: Br7TextString
  "br7:PersonName": Br7PersonName
}

export interface Br7PersonName {
  "ds:FamilyName": Br7NameSequenceTextString
  "ds:GivenName"?: Br7NameSequenceTextString | Br7NameSequenceTextString[]
  "ds:Title"?: Br7TextString
}

export interface Br7AlcoholLevel {
  "ds:Amount": Br7TextString
  "ds:Method": Br7LiteralTextString
}

export interface Br7Offence {
  "@_hasError"?: boolean
  "@_SchemaVersion"?: string
  "br7:AddedByTheCourt"?: Br7LiteralTextString
  "br7:CommittedOnBail": Br7LiteralTextString
  "br7:CourtCaseReferenceNumber"?: Br7TextString
  "br7:CourtOffenceSequenceNumber": Br7TextString
  "br7:ManualCourtCaseReference"?: Br7LiteralTextString
  "br7:ManualSequenceNo"?: Br7LiteralTextString
  "br7:Result": Br7Result | Br7Result[]
  "ds:ActualOffenceDateCode": Br7LiteralTextString
  "ds:ActualOffenceEndDate"?: DsActualOffenceEndDate
  "ds:ActualOffenceStartDate": DsActualOffenceStartDate
  "ds:ActualOffenceWording": Br7TextString
  "ds:AlcoholLevel"?: Br7AlcoholLevel
  "ds:ArrestDate"?: Br7TextString
  "ds:ChargeDate"?: Br7TextString
  "ds:ConvictionDate"?: Br7TextString
  "ds:CriminalProsecutionReference": Br7CriminalProsecutionReference
  "ds:HomeOfficeClassification"?: Br7TextString
  "ds:LocationOfOffence"?: Br7TextString
  "ds:NotifiableToHOindicator"?: Br7LiteralTextString
  "ds:OffenceCategory"?: Br7LiteralTextString
  "ds:OffenceTitle"?: Br7TextString
  "ds:RecordableOnPNCindicator"?: Br7LiteralTextString
}
export interface Br7ResultQualifierVariable {
  "@_SchemaVersion": string
  "ds:Code": Br7TextString
  "ds:Duration"?: Br7Duration
}
export interface Br7Result {
  "@_hasError"?: boolean
  "@_SchemaVersion"?: string
  "br7:ConvictingCourt"?: Br7TextString
  "br7:NumberOfOffencesTIC"?: Br7TextString
  "br7:PNCAdjudicationExists"?: Br7LiteralTextString
  "br7:PNCDisposalType"?: Br7TextString
  "br7:ReasonForOffenceBailConditions"?: Br7TextString
  "br7:ResultClass"?: Br7TextString
  "br7:ResultQualifierVariable"?: Br7ResultQualifierVariable[]
  "br7:Urgent"?: Br7Urgent
  "ds:AmountSpecifiedInResult"?: Br7TypeTextString[]
  "ds:BailCondition"?: Br7TextString[]
  "ds:CJSresultCode": Br7TextString
  "ds:CourtType"?: Br7TextString
  "ds:DateSpecifiedInResult"?: Br7SequenceTextString[]
  "ds:Duration"?: Br7Duration[]
  "ds:ModeOfTrialReason"?: Br7LiteralTextString
  "ds:NextCourtType"?: Br7TextString
  "ds:NextHearingDate"?: Br7TextString
  "ds:NextHearingTime"?: Br7TextString
  "ds:NextResultSourceOrganisation"?: Br7OrganisationUnit
  "ds:NumberSpecifiedInResult"?: Br7TypeTextString[]
  "ds:OffenceRemandStatus"?: Br7LiteralTextString
  "ds:PleaStatus"?: Br7LiteralTextString
  "ds:ResultHalfLifeHours"?: Br7TextString
  "ds:ResultHearingDate"?: Br7TextString
  "ds:ResultHearingType"?: Br7LiteralTextString
  "ds:ResultVariableText"?: Br7TextString
  "ds:SourceOrganisation": Br7OrganisationUnit
  "ds:Verdict"?: Br7LiteralTextString
  "ds:WarrantIssueDate"?: Br7TextString
}

export interface Br7OrganisationUnit {
  "@_SchemaVersion": string
  "ds:BottomLevelCode": Br7TextString
  "ds:OrganisationUnitCode": Br7TextString
  "ds:SecondLevelCode": Br7TextString
  "ds:ThirdLevelCode": Br7TextString
  "ds:TopLevelCode"?: Br7TextString
}

export interface DsActualOffenceEndDate {
  "ds:EndDate"?: Br7TextString
}

export interface DsActualOffenceStartDate {
  "ds:StartDate": Br7TextString
}

export interface Br7CriminalProsecutionReference {
  "@_SchemaVersion": string
  "ds:DefendantOrOffender"?: DsDefendantOrOffender
  "ds:OffenceReason"?: Br7OffenceReason
  "ds:OffenceReasonSequence"?: Br7ErrorString
}

export interface DsDefendantOrOffender {
  "ds:CheckDigit"?: Br7TextString
  "ds:DefendantOrOffenderSequenceNumber"?: Br7TextString
  "ds:OrganisationUnitIdentifierCode": Br7OrganisationUnit
  "ds:Year"?: Br7TextString
}

export interface Br7OffenceReason {
  "ds:LocalOffenceCode"?: DsLocalOffenceCode
  "ds:OffenceCode"?: CommonLawOffenceCode | IndictmentOffenceCode | NonMatchingOffenceCode
}

export interface NonMatchingOffenceCode {
  "ds:ActOrSource": Br7TextString
  "ds:Qualifier"?: Br7TextString
  "ds:Reason": Br7TextString
  "ds:Year"?: Br7TextString
}

export interface CommonLawOffenceCode {
  "ds:CommonLawOffence": Br7TextString
  "ds:Qualifier"?: Br7TextString
  "ds:Reason": Br7TextString
}

export interface IndictmentOffenceCode {
  "ds:Qualifier"?: Br7TextString
  "ds:Reason": Br7TextString
}

export interface DsLocalOffenceCode {
  "ds:AreaCode": Br7TextString
  "ds:OffenceCode": Br7TextString
}

export interface Br7Hearing {
  "@_hasError"?: boolean
  "@_SchemaVersion"?: string
  "br7:CourtHouseCode": Br7TextString
  "br7:CourtHouseName"?: Br7TextString
  "br7:CourtType"?: Br7LiteralTextString
  "br7:SourceReference": Br7SourceReference
  "ds:CourtHearingLocation": Br7OrganisationUnit
  "ds:DateOfHearing": Br7TextString
  "ds:DefendantPresentAtHearing": Br7LiteralTextString
  "ds:HearingDocumentationLanguage": Br7LiteralTextString
  "ds:HearingLanguage": Br7LiteralTextString
  "ds:TimeOfHearing": Br7TextString
}

export interface Br7SourceReference {
  "br7:DocumentName": Br7TextString
  "br7:DocumentType": Br7TextString
  "br7:UniqueID": Br7TextString
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

export type GenericAhoXmlValue = Br7TextString | Br7TextString[] | GenericAhoXml | GenericAhoXml[] | string

export type GenericAhoXml = {
  [key: string]: GenericAhoXmlValue
}
