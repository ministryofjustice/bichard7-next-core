# Bichard 7 API

The bichard7 api acts as a single point of access for the database.

## Endpoints

### GET /health

---

Endpoint for checking the application is running

If succesful will return a 200

### GET /courts-cases

---

Request Headers:

| Attribute     | Type   | Required |
| ------------- | ------ | -------- |
| authorization | string | Yes      |

Returns a list of court cases filtered by the following parameters

| Attribute           | Type                                     | Required |
| ------------------- | ---------------------------------------- | -------- |
| forces              | string []                                | Yes      |
| maxPageItems        | number 10 - 100                          | Yes      |
| allocatedToUserName | string                                   | No       |
| caseState           | enum [Resolved, Unresolved and resolved] | No       |
| courtDateRange      | Array { from: dateTime, to: dateTime }   | No       |
| courtName           | string                                   | No       |
| defendantName       | string                                   | No       |
| locked              | boolean                                  | No       |
| order               | enum [asc, desc]                         | No       |
| orderBy             | string                                   | No       |
| pageNum             | number                                   | No       |
| ptiurn              | string                                   | No       |
| reasonCode          | string                                   | No       |
| reason              | string []                                | No       |
| resolvedByUserName  | string                                   | No       |
| urgent              | enum [Urgent, Non-urgent]                | No       |

If succesful will return 200 and the following response attributes:

| Attribute  | Type        |
| ---------- | ----------- |
| result     | courtCase[] |
| totalCases | number      |

Example request:

```bash
curl --header "authorization: <api_key_stored_in_secrets_manager>" http://localhost:3333/court-cases?forces%5B0%5D=01&maxPageItems=10&allocatedToUserName=username&caseState=Resolved&courtDateRange%5B0%5D%5Bfrom%5D=2023-05-02T15%3A06%3A58.412Z&courtDateRange%5B0%5D%5Bto%5D=2023-05-02T15%3A06%3A58.412Z&courtName=courtName&defendantName=defendantName&locked=false&order=asc&orderBy=defendantName&pageNum=1&ptiurn=ptirun&reasonCode=reason&reasons%5B0%5D=Bails&resolvedByUsername=username&urgent=Urgent
```

Example response:

```json
{
  "result": [
    {
      "errorId": 6,
      "messageId": "9cf05bd0-7812-4b41-a551-bf4e88c50e82",
      "phase": 1,
      "errorStatus": "Unresolved",
      "triggerStatus": "Unresolved",
      "errorQualityChecked": 1,
      "triggerQualityChecked": 1,
      "triggerCount": 5,
      "isUrgent": true,
      "asn": "2301PM000WE",
      "courtCode": "B01YY41",
      "hearingOutcome": "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?> <br7:AnnotatedHearingOutcome xmlns:br7=\"http://schemas.cjse.gov.uk/datastandards/BR7/2007-12\" xmlns:ds=\"http://schemas.cjse.gov.uk/datastandards/2006-10\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\"> <br7:HearingOutcome> <br7:Hearing hasError=\"false\" SchemaVersion=\"4.0\"> <ds:CourtHearingLocation SchemaVersion=\"2.0\"> <ds:TopLevelCode>B</ds:TopLevelCode> <ds:SecondLevelCode>01</ds:SecondLevelCode> <ds:ThirdLevelCode>EF</ds:ThirdLevelCode> <ds:BottomLevelCode>01</ds:BottomLevelCode> <ds:OrganisationUnitCode>B01EF01</ds:OrganisationUnitCode> </ds:CourtHearingLocation> <ds:DateOfHearing>2011-09-26</ds:DateOfHearing> <ds:TimeOfHearing>10:00</ds:TimeOfHearing> <ds:HearingLanguage Literal=\"Don't Know\">D</ds:HearingLanguage> <ds:HearingDocumentationLanguage Literal=\"Don't Know\">D</ds:HearingDocumentationLanguage> <ds:DefendantPresentAtHearing Literal=\"Defendant was not present, but appeared by the presence of his/her barrister or solicitor\">A</ds:DefendantPresentAtHearing> <br7:SourceReference> <br7:DocumentName>SPI TRPRFOUR SEXOFFENCE</br7:DocumentName> <br7:UniqueID>CID-8bc6ee0a-46ac-4a0e-b9be-b03e3b041415</br7:UniqueID> <br7:DocumentType>SPI Case Result</br7:DocumentType> </br7:SourceReference> <br7:CourtType Literal=\"MC adult\">MCA</br7:CourtType> <br7:CourtHouseCode>2576</br7:CourtHouseCode> <br7:CourtHouseName>London Croydon</br7:CourtHouseName> </br7:Hearing> <br7:Case hasError=\"false\" SchemaVersion=\"4.0\"> <ds:PTIURN>01ZD0303208</ds:PTIURN> <ds:PreChargeDecisionIndicator Literal=\"No\">N</ds:PreChargeDecisionIndicator> <ds:CourtCaseReferenceNumber>97/1626/008395Q</ds:CourtCaseReferenceNumber> <br7:CourtReference> <ds:MagistratesCourtReference>01ZD0303208</ds:MagistratesCourtReference> </br7:CourtReference> <br7:RecordableOnPNCindicator Literal=\"Yes\">Y</br7:RecordableOnPNCindicator> <br7:Urgent> <br7:urgent Literal=\"Yes\">Y</br7:urgent> <br7:urgency>24</br7:urgency> </br7:Urgent> <br7:ForceOwner SchemaVersion=\"2.0\"> <ds:SecondLevelCode>01</ds:SecondLevelCode> <ds:ThirdLevelCode>ZD</ds:ThirdLevelCode> <ds:BottomLevelCode>00</ds:BottomLevelCode> <ds:OrganisationUnitCode>01ZD00</ds:OrganisationUnitCode> </br7:ForceOwner> <br7:HearingDefendant hasError=\"false\"> <br7:ArrestSummonsNumber>1101ZD0100000448754K</br7:ArrestSummonsNumber> <br7:PNCIdentifier>2000/0448754K</br7:PNCIdentifier> <br7:PNCCheckname>SEXOFFENCE</br7:PNCCheckname> <br7:DefendantDetail> <br7:PersonName> <ds:Title>Mr</ds:Title> <ds:GivenName NameSequence=\"1\">TRPRFOUR</ds:GivenName> <ds:FamilyName NameSequence=\"1\">SEXOFFENCE</ds:FamilyName> </br7:PersonName> <br7:GeneratedPNCFilename>SEXOFFENCE/TRPRFOUR</br7:GeneratedPNCFilename> <br7:BirthDate>1948-11-11</br7:BirthDate> <br7:Gender Literal=\"male\">1</br7:Gender> </br7:DefendantDetail> <br7:Address> <ds:AddressLine1>Scenario1 Address Line 1</ds:AddressLine1> <ds:AddressLine2>Scenario1 Address Line 2</ds:AddressLine2> <ds:AddressLine3>Scenario1 Address Line 3</ds:AddressLine3> </br7:Address> <br7:RemandStatus Literal=\"Unconditional Bail\">UB</br7:RemandStatus> <br7:Offence hasError=\"false\" SchemaVersion=\"4.0\"> <ds:CriminalProsecutionReference SchemaVersion=\"2.0\"> <ds:DefendantOrOffender> <ds:Year>11</ds:Year> <ds:OrganisationUnitIdentifierCode SchemaVersion=\"2.0\"> <ds:SecondLevelCode>01</ds:SecondLevelCode> <ds:ThirdLevelCode>ZD</ds:ThirdLevelCode> <ds:BottomLevelCode>01</ds:BottomLevelCode> <ds:OrganisationUnitCode>01ZD01</ds:OrganisationUnitCode> </ds:OrganisationUnitIdentifierCode> <ds:DefendantOrOffenderSequenceNumber>00000448754</ds:DefendantOrOffenderSequenceNumber> <ds:CheckDigit>K</ds:CheckDigit> </ds:DefendantOrOffender> <ds:OffenceReason> <ds:OffenceCode> <ds:ActOrSource>SX</ds:ActOrSource> <ds:Year>03</ds:Year> <ds:Reason>001</ds:Reason> <ds:Qualifier>A</ds:Qualifier> </ds:OffenceCode> </ds:OffenceReason> <ds:OffenceReasonSequence>001</ds:OffenceReasonSequence> </ds:CriminalProsecutionReference> <ds:OffenceCategory Literal=\"Indictable\">CI</ds:OffenceCategory> <ds:ArrestDate>2010-12-01</ds:ArrestDate> <ds:ChargeDate>2010-12-02</ds:ChargeDate> <ds:ActualOffenceDateCode Literal=\"on or in\">1</ds:ActualOffenceDateCode> <ds:ActualOffenceStartDate> <ds:StartDate>2010-11-28</ds:StartDate> </ds:ActualOffenceStartDate> <ds:LocationOfOffence>Kingston High Street</ds:LocationOfOffence> <ds:OffenceTitle>Attempt to rape a girl aged 13 / 14 / 15 years of age - SOA 2003</ds:OffenceTitle> <ds:ActualOffenceWording>Attempt to rape a girl aged 13 / 14 / 15 / years of age - SOA 2003.</ds:ActualOffenceWording> <ds:RecordableOnPNCindicator Literal=\"Yes\">Y</ds:RecordableOnPNCindicator> <ds:NotifiableToHOindicator Literal=\"Yes\">Y</ds:NotifiableToHOindicator> <ds:HomeOfficeClassification>019/11</ds:HomeOfficeClassification> <ds:ConvictionDate>2011-09-26</ds:ConvictionDate> <br7:CommittedOnBail Literal=\"Don't Know\">D</br7:CommittedOnBail> <br7:CourtOffenceSequenceNumber>1</br7:CourtOffenceSequenceNumber> <br7:Result hasError=\"false\" SchemaVersion=\"2.0\"> <ds:CJSresultCode>3078</ds:CJSresultCode> <ds:SourceOrganisation SchemaVersion=\"2.0\"> <ds:TopLevelCode>B</ds:TopLevelCode> <ds:SecondLevelCode>01</ds:SecondLevelCode> <ds:ThirdLevelCode>EF</ds:ThirdLevelCode> <ds:BottomLevelCode>01</ds:BottomLevelCode> <ds:OrganisationUnitCode>B01EF01</ds:OrganisationUnitCode> </ds:SourceOrganisation> <ds:CourtType>MCA</ds:CourtType> <ds:ResultHearingType Literal=\"Other\">OTHER</ds:ResultHearingType> <ds:ResultHearingDate>2011-09-26</ds:ResultHearingDate> <ds:PleaStatus Literal=\"Not Guilty\">NG</ds:PleaStatus> <ds:Verdict Literal=\"Guilty\">G</ds:Verdict> <ds:ModeOfTrialReason Literal=\"Summary only\">SUM</ds:ModeOfTrialReason> <ds:ResultVariableText>Travel Restriction Order</ds:ResultVariableText> <ds:ResultHalfLifeHours>72</ds:ResultHalfLifeHours> <br7:PNCDisposalType>3078</br7:PNCDisposalType> <br7:ResultClass>Judgement with final result</br7:ResultClass> <br7:PNCAdjudicationExists Literal=\"No\">N</br7:PNCAdjudicationExists> </br7:Result> </br7:Offence> <br7:Offence hasError=\"false\" SchemaVersion=\"4.0\"> <ds:CriminalProsecutionReference SchemaVersion=\"2.0\"> <ds:DefendantOrOffender> <ds:Year>11</ds:Year> <ds:OrganisationUnitIdentifierCode SchemaVersion=\"2.0\"> <ds:SecondLevelCode>01</ds:SecondLevelCode> <ds:ThirdLevelCode>ZD</ds:ThirdLevelCode> <ds:BottomLevelCode>01</ds:BottomLevelCode> <ds:OrganisationUnitCode>01ZD01</ds:OrganisationUnitCode> </ds:OrganisationUnitIdentifierCode> <ds:DefendantOrOffenderSequenceNumber>00000448754</ds:DefendantOrOffenderSequenceNumber> <ds:CheckDigit>K</ds:CheckDigit> </ds:DefendantOrOffender> <ds:OffenceReason> <ds:OffenceCode> <ds:ActOrSource>SX</ds:ActOrSource> <ds:Year>03</ds:Year> <ds:Reason>001</ds:Reason> </ds:OffenceCode> </ds:OffenceReason> <ds:OffenceReasonSequence>002</ds:OffenceReasonSequence> </ds:CriminalProsecutionReference> <ds:OffenceCategory Literal=\"Indictable\">CI</ds:OffenceCategory> <ds:ArrestDate>2010-12-01</ds:ArrestDate> <ds:ChargeDate>2010-12-02</ds:ChargeDate> <ds:ActualOffenceDateCode Literal=\"on or in\">1</ds:ActualOffenceDateCode> <ds:ActualOffenceStartDate> <ds:StartDate>2010-11-28</ds:StartDate> </ds:ActualOffenceStartDate> <ds:LocationOfOffence>Kingston High Street</ds:LocationOfOffence> <ds:OffenceTitle>Rape a girl aged 13 / 14 / 15 - SOA 2003</ds:OffenceTitle> <ds:ActualOffenceWording>Rape of a Female</ds:ActualOffenceWording> <ds:RecordableOnPNCindicator Literal=\"Yes\">Y</ds:RecordableOnPNCindicator> <ds:NotifiableToHOindicator Literal=\"Yes\">Y</ds:NotifiableToHOindicator> <ds:HomeOfficeClassification>019/07</ds:HomeOfficeClassification> <ds:ConvictionDate>2011-09-26</ds:ConvictionDate> <br7:CommittedOnBail Literal=\"Don't Know\">D</br7:CommittedOnBail> <br7:CourtOffenceSequenceNumber>2</br7:CourtOffenceSequenceNumber> <br7:Result hasError=\"false\" SchemaVersion=\"2.0\"> <ds:CJSresultCode>3052</ds:CJSresultCode> <ds:SourceOrganisation SchemaVersion=\"2.0\"> <ds:TopLevelCode>B</ds:TopLevelCode> <ds:SecondLevelCode>01</ds:SecondLevelCode> <ds:ThirdLevelCode>EF</ds:ThirdLevelCode> <ds:BottomLevelCode>01</ds:BottomLevelCode> <ds:OrganisationUnitCode>B01EF01</ds:OrganisationUnitCode> </ds:SourceOrganisation> <ds:CourtType>MCA</ds:CourtType> <ds:ResultHearingType Literal=\"Other\">OTHER</ds:ResultHearingType> <ds:ResultHearingDate>2011-09-26</ds:ResultHearingDate> <ds:PleaStatus Literal=\"Not Guilty\">NG</ds:PleaStatus> <ds:Verdict Literal=\"Guilty\">G</ds:Verdict> <ds:ModeOfTrialReason Literal=\"Summary only\">SUM</ds:ModeOfTrialReason> <ds:ResultVariableText>defendant must never be allowed out</ds:ResultVariableText> <ds:ResultHalfLifeHours>24</ds:ResultHalfLifeHours> <br7:PNCDisposalType>3052</br7:PNCDisposalType> <br7:ResultClass>Judgement with final result</br7:ResultClass> <br7:Urgent> <br7:urgent Literal=\"Yes\">Y</br7:urgent> <br7:urgency>24</br7:urgency> </br7:Urgent> <br7:PNCAdjudicationExists Literal=\"No\">N</br7:PNCAdjudicationExists> </br7:Result> </br7:Offence> <br7:Offence hasError=\"false\" SchemaVersion=\"4.0\"> <ds:CriminalProsecutionReference SchemaVersion=\"2.0\"> <ds:DefendantOrOffender> <ds:Year>11</ds:Year> <ds:OrganisationUnitIdentifierCode SchemaVersion=\"2.0\"> <ds:SecondLevelCode>01</ds:SecondLevelCode> <ds:ThirdLevelCode>ZD</ds:ThirdLevelCode> <ds:BottomLevelCode>01</ds:BottomLevelCode> <ds:OrganisationUnitCode>01ZD01</ds:OrganisationUnitCode> </ds:OrganisationUnitIdentifierCode> <ds:DefendantOrOffenderSequenceNumber>00000448754</ds:DefendantOrOffenderSequenceNumber> <ds:CheckDigit>K</ds:CheckDigit> </ds:DefendantOrOffender> <ds:OffenceReason> <ds:OffenceCode> <ds:ActOrSource>RT</ds:ActOrSource> <ds:Year>88</ds:Year> <ds:Reason>191</ds:Reason> </ds:OffenceCode> </ds:OffenceReason> <ds:OffenceReasonSequence>003</ds:OffenceReasonSequence> </ds:CriminalProsecutionReference> <ds:OffenceCategory Literal=\"Summary Motoring\">CM</ds:OffenceCategory> <ds:ArrestDate>2010-12-01</ds:ArrestDate> <ds:ChargeDate>2010-12-02</ds:ChargeDate> <ds:ActualOffenceDateCode Literal=\"on or in\">1</ds:ActualOffenceDateCode> <ds:ActualOffenceStartDate> <ds:StartDate>2010-11-28</ds:StartDate> </ds:ActualOffenceStartDate> <ds:LocationOfOffence>Kingston High Street</ds:LocationOfOffence> <ds:OffenceTitle>Use a motor vehicle on a road / public place without third party insurance</ds:OffenceTitle> <ds:ActualOffenceWording>Use a motor vehicle without third party insurance.</ds:ActualOffenceWording> <ds:RecordableOnPNCindicator Literal=\"No\">N</ds:RecordableOnPNCindicator> <ds:NotifiableToHOindicator Literal=\"No\">N</ds:NotifiableToHOindicator> <ds:HomeOfficeClassification>809/01</ds:HomeOfficeClassification> <ds:ConvictionDate>2011-09-26</ds:ConvictionDate> <br7:CommittedOnBail Literal=\"Don't Know\">D</br7:CommittedOnBail> <br7:CourtOffenceSequenceNumber>3</br7:CourtOffenceSequenceNumber> <br7:Result hasError=\"false\" SchemaVersion=\"2.0\"> <ds:CJSresultCode>1015</ds:CJSresultCode> <ds:SourceOrganisation SchemaVersion=\"2.0\"> <ds:TopLevelCode>B</ds:TopLevelCode> <ds:SecondLevelCode>01</ds:SecondLevelCode> <ds:ThirdLevelCode>EF</ds:ThirdLevelCode> <ds:BottomLevelCode>01</ds:BottomLevelCode> <ds:OrganisationUnitCode>B01EF01</ds:OrganisationUnitCode> </ds:SourceOrganisation> <ds:CourtType>MCA</ds:CourtType> <ds:ResultHearingType Literal=\"Other\">OTHER</ds:ResultHearingType> <ds:ResultHearingDate>2011-09-26</ds:ResultHearingDate> <ds:AmountSpecifiedInResult Type=\"Fine\">100.00</ds:AmountSpecifiedInResult> <ds:PleaStatus Literal=\"Not Guilty\">NG</ds:PleaStatus> <ds:Verdict Literal=\"Guilty\">G</ds:Verdict> <ds:ModeOfTrialReason Literal=\"Summary only\">SUM</ds:ModeOfTrialReason> <ds:ResultVariableText>Fined 100.</ds:ResultVariableText> <ds:ResultHalfLifeHours>72</ds:ResultHalfLifeHours> <br7:PNCDisposalType>1015</br7:PNCDisposalType> <br7:ResultClass>Judgement with final result</br7:ResultClass> <br7:PNCAdjudicationExists Literal=\"No\">N</br7:PNCAdjudicationExists> </br7:Result> </br7:Offence> </br7:HearingDefendant> </br7:Case> </br7:HearingOutcome> <br7:HasError>false</br7:HasError> <CXE01> <FSC FSCode=\"01ZD\" IntfcUpdateType=\"K\"/> <IDS CRONumber=\"\" Checkname=\"SEXOFFENCE\" IntfcUpdateType=\"K\" PNCID=\"2000/0448754K\"/> <CourtCases> <CourtCase> <CCR CourtCaseRefNo=\"97/1626/008395Q\" CrimeOffenceRefNo=\"\" IntfcUpdateType=\"K\"/> <Offences> <Offence> <COF ACPOOffenceCode=\"12:15:24:1\" CJSOffenceCode=\"SX03001A\" IntfcUpdateType=\"K\" OffEndDate=\"\" OffEndTime=\"\" OffStartDate=\"28112010\" OffStartTime=\"0000\" OffenceQualifier1=\"\" OffenceQualifier2=\"\" OffenceTitle=\"Attempt to rape a girl aged 13 / 14 / 15 years of age - SOA 2003\" ReferenceNumber=\"001\"/> </Offence> <Offence> <COF ACPOOffenceCode=\"12:15:24:1\" CJSOffenceCode=\"SX03001\" IntfcUpdateType=\"K\" OffEndDate=\"\" OffEndTime=\"\" OffStartDate=\"28112010\" OffStartTime=\"0000\" OffenceQualifier1=\"\" OffenceQualifier2=\"\" OffenceTitle=\"Rape a girl aged 13 / 14 / 15 - SOA 2003\" ReferenceNumber=\"002\"/> </Offence> <Offence> <COF ACPOOffenceCode=\"12:15:24:1\" CJSOffenceCode=\"RT88191\" IntfcUpdateType=\"K\" OffEndDate=\"\" OffEndTime=\"\" OffStartDate=\"28112010\" OffStartTime=\"0000\" OffenceQualifier1=\"\" OffenceQualifier2=\"\" OffenceTitle=\"Use a motor vehicle on a road / public place without third party insurance\" ReferenceNumber=\"003\"/> </Offence> </Offences> </CourtCase> </CourtCases> </CXE01> <br7:PNCQueryDate>2022-03-22</br7:PNCQueryDate> </br7:AnnotatedHearingOutcome>",
      "updatedHearingOutcome": null,
      "errorReport": "",
      "createdTimestamp": "2023-02-15T09:42:40.474Z",
      "errorReason": "",
      "triggerReason": "",
      "errorCount": 0,
      "userUpdatedFlag": 0,
      "courtDate": "2023-02-15T00:00:00.000Z",
      "ptiurn": "01HI8160523",
      "courtName": "Brisamouth",
      "resolutionTimestamp": null,
      "messageReceivedTimestamp": "2023-02-15T09:42:40.474Z",
      "errorResolvedBy": null,
      "triggerResolvedBy": null,
      "errorResolvedTimestamp": null,
      "triggerResolvedTimestamp": null,
      "defendantName": "GOODWIN Eladio",
      "orgForPoliceFilter": "01    ",
      "courtRoom": "06",
      "courtReference": "01HI8160523",
      "errorInsertedTimestamp": "2023-02-15T09:42:40.474Z",
      "triggerInsertedTimestamp": "2023-02-15T09:42:40.474Z",
      "pncUpdateEnabled": "Y",
      "errorLockedByUsername": null,
      "triggerLockedByUsername": null,
      "triggers": [
        {
          "triggerId": 34680,
          "triggerCode": "TRPR0010",
          "errorId": 6,
          "status": "Resolved",
          "createdAt": "2023-02-15T09:42:40.474Z",
          "resolvedBy": "mitchel.fadel",
          "resolvedAt": null,
          "triggerItemIdentity": "0"
        }
      ],
      "notes": [
        {
          "noteId": 39889,
          "noteText": "Trigger codes: 1 x TRPR0010, 2 x TRPR0020, 1 x TRPR0001, 1 x TRPS0010",
          "errorId": 6,
          "userId": "lula.leuschke",
          "createdAt": "2023-04-12T12:59:20.474Z"
        }
      ]
    }
  ],
  "totalCasses": 1
}
```
