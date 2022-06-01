export interface AhoParsedXml {
  "?xml": XML
  "br7:AnnotatedHearingOutcome": Br7AnnotatedHearingOutcome
}

export interface XML {
  "@_version": string
  "@_encoding": string
  "@_standalone": string
}

export interface Br7AnnotatedHearingOutcome {
  "br7:HearingOutcome": Br7HearingOutcome
  "br7:HasError": boolean
  CXE01: Cxe01
  "br7:PNCQueryDate"?: string
  "@_xmlns:ds": string
  "@_xmlns:xsi": string
  "@_xmlns:br7": string
}

export interface Cxe01 {
  FSC: Fsc
  IDS: IDS
  CourtCases: CourtCases
}

export interface CourtCases {
  CourtCase?: CourtCase[]
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
  Offence: Offence[]
}

export interface Offence {
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
  DIS: Dis[]
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

export interface Br7HearingOutcome {
  "br7:Hearing": Br7Hearing
  "br7:Case": Br7Case
}

export interface Br7Case {
  "ds:PTIURN": string
  "ds:CourtCaseReferenceNumber"?: string
  "ds:PreChargeDecisionIndicator": Br7LiteralTextString
  "br7:CourtReference": Br7CourtReference
  "br7:RecordableOnPNCindicator": Br7LiteralTextString
  "br7:Urgent"?: Br7Urgent
  "br7:ForceOwner"?: Br7OrganisationUnit
  "br7:HearingDefendant": Br7HearingDefendant
  "@_hasError": string
  "@_SchemaVersion": string
}

export interface Br7Urgent {
  "br7:urgent": Br7LiteralTextString
  "br7:urgency": number
}

export interface Br7CourtReference {
  "ds:MagistratesCourtReference": string
}

export interface Br7HearingDefendant {
  "br7:ArrestSummonsNumber": Br7ArrestSummonsNumber
  "br7:PNCIdentifier"?: string
  "br7:PNCCheckname"?: string
  "br7:DefendantDetail": Br7DefendantDetail
  "br7:Address": Br7Address
  "br7:RemandStatus": Br7LiteralTextString
  "br7:CourtPNCIdentifier"?: string
  "br7:Offence": Br7Offence[]
  "@_hasError": string
}

export interface Br7Address {
  "ds:AddressLine1": string
  "ds:AddressLine2"?: string
  "ds:AddressLine3"?: string
}

export interface Br7ArrestSummonsNumber {
  "#text": string
  "@_Error"?: string
}

export interface Br7DefendantDetail {
  "br7:PersonName": Br7PersonName
  "br7:GeneratedPNCFilename"?: string
  "br7:BirthDate"?: string
  "br7:Gender": Br7Gender
}

export interface Br7Gender {
  "#text": number
  "@_Literal"?: string
}

export interface Br7PersonName {
  "ds:Title"?: string
  "ds:GivenName": DsName
  "ds:FamilyName": DsName
}

export interface DsName {
  "#text": string
  "@_NameSequence": string
}

export interface Br7Offence {
  "ds:CriminalProsecutionReference": Br7CriminalProsecutionReference
  "ds:OffenceCategory": Br7LiteralTextString
  "ds:ArrestDate": string
  "ds:ChargeDate": string
  "ds:ActualOffenceDateCode": Br7Gender
  "ds:ActualOffenceStartDate": DsActualOffenceStartDate
  "ds:ActualOffenceEndDate"?: DsActualOffenceEndDate
  "ds:LocationOfOffence": string
  "ds:OffenceTitle"?: string
  "ds:ActualOffenceWording": string
  "ds:RecordableOnPNCindicator": Br7LiteralTextString
  "ds:NotifiableToHOindicator": Br7LiteralTextString
  "ds:HomeOfficeClassification"?: string
  "ds:ConvictionDate": string
  "br7:CommittedOnBail": Br7LiteralTextString
  "br7:CourtOffenceSequenceNumber": number
  // "br7:AddedByTheCourt": Br7LiteralTextString
  "br7:Result": Br7Result | Br7Result[]
  "@_hasError": string
  "@_SchemaVersion": string
}

export interface Br7Result {
  "ds:CJSresultCode": number
  "ds:SourceOrganisation": Br7OrganisationUnit
  "ds:CourtType"?: string
  "ds:ResultHearingType"?: Br7LiteralTextString
  "ds:ResultHearingDate"?: string
  // "ds:AmountSpecifiedInResult": string
  "ds:PleaStatus"?: Br7LiteralTextString
  "ds:Verdict": Br7LiteralTextString
  "ds:ModeOfTrialReason"?: Br7LiteralTextString
  "ds:ResultVariableText"?: string
  "ds:ResultHalfLifeHours"?: number
  "br7:PNCDisposalType"?: number
  "br7:ResultClass"?: string
  "br7:PNCAdjudicationExists": Br7LiteralTextString
  "br7:ConvictingCourt"?: string
  "@_hasError": string
  "@_SchemaVersion": string
}

export interface Br7OrganisationUnit {
  "ds:TopLevelCode"?: string
  "ds:SecondLevelCode"?: string
  "ds:ThirdLevelCode"?: string
  "ds:BottomLevelCode"?: string
  "ds:OrganisationUnitCode"?: string
  "@_SchemaVersion": string
}

export interface DsActualOffenceEndDate {
  "ds:EndDate": string
}

export interface DsActualOffenceStartDate {
  "ds:StartDate": string
}

export interface Br7CriminalProsecutionReference {
  "ds:DefendantOrOffender": DsDefendantOrOffender
  "ds:OffenceReason"?: Br7OffenceReason
  "ds:OffenceReasonSequence"?: number
  "@_SchemaVersion": string
}

export interface DsDefendantOrOffender {
  "ds:Year": string
  "ds:OrganisationUnitIdentifierCode": Br7OrganisationUnit
  "ds:DefendantOrOffenderSequenceNumber": string
  "ds:CheckDigit"?: string
}

export interface Br7OffenceReason {
  "ds:OffenceCode"?: NonMatchingOffenceCode | CommonLawOffenceCode | IndictmentOffenceCode
  "ds:LocalOffenceCode"?: DsLocalOffenceCode
}

export interface NonMatchingOffenceCode {
  "ds:ActOrSource": string
  "ds:Year": string
  "ds:Reason": number
  "ds:Qualifier"?: string
}

export interface CommonLawOffenceCode {
  "ds:CommonLawOffence": string
  "ds:Reason": number
  "ds:Qualifier"?: string
}

export interface IndictmentOffenceCode {
  "ds:Reason": number
  "ds:Qualifier"?: string
}

export interface DsLocalOffenceCode {
  "ds:AreaCode": string
  "ds:OffenceCode": Br7ErrorTextString
}

export interface Br7Hearing {
  "ds:CourtHearingLocation": Br7OrganisationUnit
  "ds:DateOfHearing": string
  "ds:TimeOfHearing": string
  "ds:HearingLanguage": Br7LiteralTextString
  "ds:HearingDocumentationLanguage": Br7LiteralTextString
  "ds:DefendantPresentAtHearing": Br7LiteralTextString
  "br7:SourceReference": Br7SourceReference
  "br7:CourtType"?: Br7LiteralTextString
  "br7:CourtHouseCode": number
  "br7:CourtHouseName"?: string
  "@_hasError": string
  "@_SchemaVersion": string
}

export interface Br7SourceReference {
  "br7:DocumentName": string
  "br7:UniqueID": string
  "br7:DocumentType": string
}

export interface Br7LiteralTextString {
  "#text"?: string
  "@_Literal"?: string
}

export interface Br7ErrorTextString {
  "#text"?: string
  "@_Error"?: string
}
