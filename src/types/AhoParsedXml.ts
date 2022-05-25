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
  "br7:PNCQueryDate": string
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
  Offence: Offence[]
}

export interface Offence {
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

export interface Br7HearingOutcome {
  "br7:Hearing": Br7Hearing
  "br7:Case": Br7Case
}

export interface Br7Case {
  "ds:PTIURN": string
  "ds:PreChargeDecisionIndicator": Br7RecordableOnPnCindicator
  "br7:CourtReference": Br7CourtReference
  "br7:RecordableOnPNCindicator": Br7RecordableOnPnCindicator
  "br7:ForceOwner": Ds
  "br7:HearingDefendant": Br7HearingDefendant
  "@_hasError": string
  "@_SchemaVersion": string
}

export interface Br7CourtReference {
  "ds:MagistratesCourtReference": string
}

export interface Br7HearingDefendant {
  "br7:ArrestSummonsNumber": Br7ArrestSummonsNumber
  "br7:DefendantDetail": Br7DefendantDetail
  "br7:Address": Br7Address
  "br7:RemandStatus": Br7RecordableOnPnCindicator
  "br7:CourtPNCIdentifier": string
  "br7:Offence": Br7Offence[]
  "@_hasError": string
}

export interface Br7Address {
  "ds:AddressLine1": string
  "ds:AddressLine2": string
  "ds:AddressLine3": string
}

export interface Br7ArrestSummonsNumber {
  "#text": string
  "@_Error": string
}

export interface Br7DefendantDetail {
  "br7:PersonName": Br7PersonName
  "br7:GeneratedPNCFilename": string
  "br7:BirthDate": string
  "br7:Gender": Br7Gender
}

export interface Br7Gender {
  "#text": number
  "@_Literal": string
}

export interface Br7PersonName {
  "ds:Title": string
  "ds:GivenName": DsName
  "ds:FamilyName": DsName
}

export interface DsName {
  "#text": string
  "@_NameSequence": string
}

export interface Br7Offence {
  "ds:CriminalProsecutionReference": DsCriminalProsecutionReference
  "ds:OffenceCategory": Br7RecordableOnPnCindicator
  "ds:ArrestDate": string
  "ds:ChargeDate": string
  "ds:ActualOffenceDateCode": Br7Gender
  "ds:ActualOffenceStartDate": DsActualOffenceStartDate
  "ds:ActualOffenceEndDate": DsActualOffenceEndDate
  "ds:LocationOfOffence": string
  "ds:OffenceTitle": string
  "ds:ActualOffenceWording": string
  "ds:RecordableOnPNCindicator": Br7RecordableOnPnCindicator
  "ds:NotifiableToHOindicator": Br7RecordableOnPnCindicator
  "ds:HomeOfficeClassification": string
  "ds:ConvictionDate": string
  "br7:CommittedOnBail": Br7RecordableOnPnCindicator
  "br7:CourtOffenceSequenceNumber": number
  "br7:AddedByTheCourt": Br7RecordableOnPnCindicator
  "br7:Result": Br7Result
  "@_hasError": string
  "@_SchemaVersion": string
}

export interface Br7RecordableOnPnCindicator {
  "#text": string
  "@_Literal": string
}

export interface Br7Result {
  "ds:CJSresultCode": number
  "ds:SourceOrganisation": Ds
  "ds:CourtType": string
  "ds:ResultHearingType": Br7RecordableOnPnCindicator
  "ds:ResultHearingDate": string
  "ds:PleaStatus": Br7RecordableOnPnCindicator
  "ds:ModeOfTrialReason": Br7RecordableOnPnCindicator
  "ds:ResultVariableText": string
  "ds:ResultHalfLifeHours": number
  "br7:PNCDisposalType": number
  "br7:ResultClass": string
  "br7:ConvictingCourt": number
  "@_hasError": string
  "@_SchemaVersion": string
}

export interface Ds {
  "ds:TopLevelCode"?: string
  "ds:SecondLevelCode": string
  "ds:ThirdLevelCode": string
  "ds:BottomLevelCode": string
  "ds:OrganisationUnitCode": string
  "@_SchemaVersion": string
}

export interface DsActualOffenceEndDate {
  "ds:EndDate": string
}

export interface DsActualOffenceStartDate {
  "ds:StartDate": string
}

export interface DsCriminalProsecutionReference {
  "ds:DefendantOrOffender": DsDefendantOrOffender
  "ds:OffenceReason": DsOffenceReason
  "@_SchemaVersion": string
}

export interface DsDefendantOrOffender {
  "ds:Year": number
  "ds:OrganisationUnitIdentifierCode": Ds
  "ds:DefendantOrOffenderSequenceNumber": number
  "ds:CheckDigit": string
}

export interface DsOffenceReason {
  "ds:OffenceCode": DsOffenceCode
}

export interface DsOffenceCode {
  "ds:ActOrSource": string
  "ds:Year": number
  "ds:Reason": number
}

export interface Br7Hearing {
  "ds:CourtHearingLocation": Ds
  "ds:DateOfHearing": string
  "ds:TimeOfHearing": string
  "ds:HearingLanguage": Br7RecordableOnPnCindicator
  "ds:HearingDocumentationLanguage": Br7RecordableOnPnCindicator
  "ds:DefendantPresentAtHearing": Br7RecordableOnPnCindicator
  "br7:SourceReference": Br7SourceReference
  "br7:CourtType": Br7RecordableOnPnCindicator
  "br7:CourtHouseCode": number
  "br7:CourtHouseName": string
  "@_hasError": string
  "@_SchemaVersion": string
}

export interface Br7SourceReference {
  "br7:DocumentName": string
  "br7:UniqueID": string
  "br7:DocumentType": string
}
