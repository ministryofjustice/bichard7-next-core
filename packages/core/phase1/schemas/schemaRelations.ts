const schemaRelations = {
  "AnnotatedHearingOutcome > HearingOutcome > Hearing": [
    "DeliverRequest > Message > ResultedCaseMessage",
    "DeliverRequest > MessageIdentifier"
  ],
  "AnnotatedHearingOutcome > HearingOutcome > Hearing > CourtHearingLocation": [
    "DeliverRequest > Message > ResultedCaseMessage > Session > CourtHearing > Hearing > CourtHearingLocation"
  ],
  "AnnotatedHearingOutcome > HearingOutcome > Hearing > DateOfHearing": [
    "DeliverRequest > Message > ResultedCaseMessage > Session > CourtHearing > Hearing > DateOfHearing"
  ],
  "AnnotatedHearingOutcome > HearingOutcome > Hearing > TimeOfHearing": [
    "DeliverRequest > Message > ResultedCaseMessage > Session > CourtHearing > Hearing > TimeOfHearing"
  ],
  "AnnotatedHearingOutcome > HearingOutcome > Hearing > DefendantPresentAtHearing": [
    "DeliverRequest > Message > ResultedCaseMessage > Session > Case > Defendant > CourtIndividualDefendant > PresentAtHearing",
    "DeliverRequest > Message > ResultedCaseMessage > Session > Case > Defendant > CourtCorporateDefendant > PresentAtHearing"
  ],
  "AnnotatedHearingOutcome > HearingOutcome > Hearing > SourceReference": [
    "DeliverRequest > Message > ResultedCaseMessage > Session > Case > Defendant > CourtIndividualDefendant > PersonDefendant > BasePersonDetails > PersonName",
    "DeliverRequest > Message > ResultedCaseMessage > Session > Case > Defendant > CourtCorporateDefendant > OrganisationName > OrganisationName",
    "DeliverRequest > MessageIdentifier"
  ],
  "AnnotatedHearingOutcome > HearingOutcome > Hearing > CourtType": [
    "AnnotatedHearingOutcome > HearingOutcome > Hearing > CourtHearingLocation",
    "AnnotatedHearingOutcome > HearingOutcome > Hearing > CourtHouseName"
  ],
  "AnnotatedHearingOutcome > HearingOutcome > Hearing > CourtHouseName": [
    "AnnotatedHearingOutcome > HearingOutcome > Hearing > CourtHearingLocation"
  ],
  "AnnotatedHearingOutcome > HearingOutcome > Hearing > CourtHouseCode": [
    "DeliverRequest > Message > ResultedCaseMessage > Session > CourtHearing > Hearing > PSAcode"
  ],
  "AnnotatedHearingOutcome > HearingOutcome > Case": ["DeliverRequest > Message > ResultedCaseMessage"],
  "AnnotatedHearingOutcome > HearingOutcome > Case > RecordableOnPNCindicator": [
    "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > Offence > RecordableOnPNCindicator",
    "PncQuery"
  ],
  "AnnotatedHearingOutcome > HearingOutcome > Case > Urgent": [
    "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > Result > Urgent > urgency"
  ],
  "AnnotatedHearingOutcome > HearingOutcome > Case > PTIURN": [
    "DeliverRequest > Message > ResultedCaseMessage > Session > Case > PTIURN"
  ],
  "AnnotatedHearingOutcome > HearingOutcome > Case > CourtReference > MagistratesCourtReference": [
    "DeliverRequest > Message > ResultedCaseMessage > Session > Case > PTIURN",
    "AnnotatedHearingOutcome > HearingOutcome > Case > PTIURN"
  ],
  "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > ArrestSummonsNumber": [
    "DeliverRequest > Message > ResultedCaseMessage > Session > Case > Defendant > ProsecutorReference"
  ],
  "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > CourtPNCIdentifier": [
    "DeliverRequest > Message > ResultedCaseMessage > Session > Case > Defendant > CourtIndividualDefendant > PersonDefendant > PNCidentifier",
    "DeliverRequest > Message > ResultedCaseMessage > Session > Case > Defendant > CourtCorporateDefendant > PNCidentifier"
  ],
  "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > DefendantDetail > GeneratedPNCFilename": [
    "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > DefendantDetail > PersonName > FamilyName",
    "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > DefendantDetail > PersonName > GivenName"
  ],
  "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > DefendantDetail > PersonName": [
    "DeliverRequest > Message > ResultedCaseMessage > Session > Case > Defendant > CourtIndividualDefendant > PersonDefendant"
  ],
  "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > DefendantDetail > PersonName > Title": [
    "DeliverRequest > Message > ResultedCaseMessage > Session > Case > Defendant > CourtIndividualDefendant > PersonDefendant > BasePersonDetails > PersonName > PersonTitle"
  ],
  "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > DefendantDetail > PersonName > GivenName": [
    "DeliverRequest > Message > ResultedCaseMessage > Session > Case > Defendant > CourtIndividualDefendant > PersonDefendant > BasePersonDetails > PersonName > PersonGivenName1",
    "DeliverRequest > Message > ResultedCaseMessage > Session > Case > Defendant > CourtIndividualDefendant > PersonDefendant > BasePersonDetails > PersonName > PersonGivenName2",
    "DeliverRequest > Message > ResultedCaseMessage > Session > Case > Defendant > CourtIndividualDefendant > PersonDefendant > BasePersonDetails > PersonName > PersonGivenName3"
  ],
  "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > DefendantDetail > PersonName > FamilyName": [
    "DeliverRequest > Message > ResultedCaseMessage > Session > Case > Defendant > CourtIndividualDefendant > PersonDefendant > BasePersonDetails > PersonName > PersonFamilyName"
  ],
  "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > DefendantDetail > BirthDate": [
    "DeliverRequest > Message > ResultedCaseMessage > Session > Case > Defendant > CourtIndividualDefendant > PersonDefendant > BasePersonDetails > Birthdate"
  ],
  "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > DefendantDetail > Gender": [
    "DeliverRequest > Message > ResultedCaseMessage > Session > Case > Defendant > CourtIndividualDefendant > PersonDefendant > BasePersonDetails > Gender"
  ],
  "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > Address": [
    "DeliverRequest > Message > ResultedCaseMessage > Session > Case > Defendant > CourtIndividualDefendant > Address > SimpleAddress",
    "DeliverRequest > Message > ResultedCaseMessage > Session > Case > Defendant > CourtIndividualDefendant > Address > ComplexAddress",
    "DeliverRequest > Message > ResultedCaseMessage > Session > Case > Defendant > CourtCorporateDefendant > Address > SimpleAddress",
    "DeliverRequest > Message > ResultedCaseMessage > Session > Case > Defendant > CourtCorporateDefendant > Address > ComplexAddress"
  ],
  "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > RemandStatus": [
    "DeliverRequest > Message > ResultedCaseMessage > Session > Case > Defendant > CourtIndividualDefendant > BailStatus",
    "DeliverRequest > Message > ResultedCaseMessage > Session > Case > Defendant > CourtCorporateDefendant > BailStatus"
  ],
  "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > BailConditions": [
    "DeliverRequest > Message > ResultedCaseMessage > Session > Case > Defendant > CourtIndividualDefendant > PersonDefendant > BailConditions",
    "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > Result > CJSresultCode",
    "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > Result > ResultCodeQualifier"
  ],
  "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > ReasonForBailConditions": [
    "DeliverRequest > Message > ResultedCaseMessage > Session > Case > Defendant > CourtIndividualDefendant > ReasonForBailConditionsOrCustody"
  ],
  "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > OrganisationName": [
    "DeliverRequest > Message > ResultedCaseMessage > Session > Case > Defendant > CourtIndividualDefendant > OrganisationName > OrganisationName"
  ],
  "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > Offence": [
    "DeliverRequest > Message > ResultedCaseMessage > Session > Case > Defendant > Offence"
  ],
  "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > Offence > CriminalProsecutionReference > DefendantOrOffender > Year":
    ["AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > ArrestSummonsNumber"],
  "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > Offence > CriminalProsecutionReference > DefendantOrOffender > OrganisationUnitIdentifierCode":
    ["AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > ArrestSummonsNumber"],
  "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > Offence > CriminalProsecutionReference > DefendantOrOffender > DefendantOrOffenderSequenceNumber":
    ["AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > ArrestSummonsNumber"],
  "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > Offence > CriminalProsecutionReference > DefendantOrOffender > CheckDigit":
    ["AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > ArrestSummonsNumber"],
  "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > Offence > CriminalProsecutionReference > OffenceReason > OffenceCode":
    [
      "DeliverRequest > Message > ResultedCaseMessage > Session > Case > Defendant > Offence > BaseOffenceDetails > OffenceCode"
    ],
  "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > Offence > CriminalProsecutionReference > OffenceReason > OffenceCode > Reason":
    [
      "DeliverRequest > Message > ResultedCaseMessage > Session > Case > Defendant > Offence > BaseOffenceDetails > OffenceCode"
    ],
  "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > Offence > CriminalProsecutionReference > OffenceReason > OffenceCode > Qualifier":
    [
      "DeliverRequest > Message > ResultedCaseMessage > Session > Case > Defendant > Offence > BaseOffenceDetails > OffenceCode"
    ],
  "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > Offence > CriminalProsecutionReference > OffenceReason > OffenceCode > FullCode":
    [
      "DeliverRequest > Message > ResultedCaseMessage > Session > Case > Defendant > Offence > BaseOffenceDetails > OffenceCode"
    ],
  "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > Offence > CriminalProsecutionReference > OffenceReason > OffenceCode > CommonLawOffence":
    [
      "DeliverRequest > Message > ResultedCaseMessage > Session > Case > Defendant > Offence > BaseOffenceDetails > OffenceCode"
    ],
  "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > Offence > CriminalProsecutionReference > OffenceReason > OffenceCode > Indictment":
    [
      "DeliverRequest > Message > ResultedCaseMessage > Session > Case > Defendant > Offence > BaseOffenceDetails > OffenceCode"
    ],
  "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > Offence > CriminalProsecutionReference > OffenceReason > OffenceCode > ActOrSource":
    [
      "DeliverRequest > Message > ResultedCaseMessage > Session > Case > Defendant > Offence > BaseOffenceDetails > OffenceCode"
    ],
  "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > Offence > CriminalProsecutionReference > OffenceReason > OffenceCode > Year":
    [
      "DeliverRequest > Message > ResultedCaseMessage > Session > Case > Defendant > Offence > BaseOffenceDetails > OffenceCode"
    ],
  "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > Offence > OffenceCategory": [
    "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > Offence > CriminalProsecutionReference > OffenceReason > OffenceCode > FullCode",
    "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > Offence > CriminalProsecutionReference > OffenceReason > LocalOffenceCode > OffenceCode"
  ],
  "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > Offence > RecordableOnPNCindicator": [
    "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > Offence > CriminalProsecutionReference > OffenceReason > OffenceCode > FullCode",
    "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > Offence > CriminalProsecutionReference > OffenceReason > LocalOffenceCode > OffenceCode"
  ],
  "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > Offence > OffenceTitle": [
    "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > Offence > CriminalProsecutionReference > OffenceReason > OffenceCode > FullCode",
    "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > Offence > CriminalProsecutionReference > OffenceReason > LocalOffenceCode > OffenceCode"
  ],
  "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > Offence > NotifiableToHOindicator": [
    "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > Offence > CriminalProsecutionReference > OffenceReason > OffenceCode > FullCode",
    "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > Offence > CriminalProsecutionReference > OffenceReason > LocalOffenceCode > OffenceCode"
  ],
  "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > Offence > HomeOfficeClassification": [
    "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > Offence > CriminalProsecutionReference > OffenceReason > OffenceCode > FullCode",
    "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > Offence > CriminalProsecutionReference > OffenceReason > LocalOffenceCode > OffenceCode"
  ],
  "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > Offence > ResultHalfLifeHours": [
    "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > Offence > CriminalProsecutionReference > OffenceReason > OffenceCode > FullCode",
    "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > Offence > CriminalProsecutionReference > OffenceReason > LocalOffenceCode > OffenceCode"
  ],
  "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > Offence > ArrestDate": [
    "DeliverRequest > Message > ResultedCaseMessage > Session > Case > Defendant > Offence > BaseOffenceDetails > ArrestDate"
  ],
  "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > Offence > ChargeDate": [
    "DeliverRequest > Message > ResultedCaseMessage > Session > Case > Defendant > Offence > BaseOffenceDetails > ChargeDate"
  ],
  "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > Offence > ActualOffenceDateCode": [
    "DeliverRequest > Message > ResultedCaseMessage > Session > Case > Defendant > Offence > BaseOffenceDetails > OffenceTiming > OffenceDateCode"
  ],
  "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > Offence > ActualOffenceStartDate > StartDate": [
    "DeliverRequest > Message > ResultedCaseMessage > Session > Case > Defendant > Offence > BaseOffenceDetails > OffenceTiming > OffenceStart > OffenceDateStartDate"
  ],
  "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > Offence > ActualOffenceEndDate": [
    "DeliverRequest > Message > ResultedCaseMessage > Session > Case > Defendant > Offence > BaseOffenceDetails > OffenceTiming > OffenceEnd"
  ],
  "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > Offence > ActualOffenceEndDate > EndDate": [
    "DeliverRequest > Message > ResultedCaseMessage > Session > Case > Defendant > Offence > BaseOffenceDetails > OffenceTiming > OffenceEnd > OffenceEndDate"
  ],
  "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > Offence > LocationOfOffence": [
    "DeliverRequest > Message > ResultedCaseMessage > Session > Case > Defendant > Offence > BaseOffenceDetails > LocationOfOffence"
  ],
  "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > Offence > ActualOffenceWording": [
    "DeliverRequest > Message > ResultedCaseMessage > Session > Case > Defendant > Offence > BaseOffenceDetails > OffenceWording"
  ],
  "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > Offence > AlcoholLevel": [
    "DeliverRequest > Message > ResultedCaseMessage > Session > Case > Defendant > Offence > BaseOffenceDetails > AlcoholRelatedOffence"
  ],
  "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > Offence > AlcoholLevel > Amount": [
    "DeliverRequest > Message > ResultedCaseMessage > Session > Case > Defendant > Offence > BaseOffenceDetails > AlcoholRelatedOffence > AlcoholLevelAmount"
  ],
  "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > Offence > AlcoholLevel > Method": [
    "DeliverRequest > Message > ResultedCaseMessage > Session > Case > Defendant > Offence > BaseOffenceDetails > AlcoholRelatedOffence > AlcoholLevelMethod"
  ],
  "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > Offence > OffenceTime": [
    "DeliverRequest > Message > ResultedCaseMessage > Session > Case > Defendant > Offence > BaseOffenceDetails > OffenceTiming > OffenceStart > OffenceStartTime",
    "DeliverRequest > Message > ResultedCaseMessage > Session > Case > Defendant > Offence > BaseOffenceDetails > OffenceTiming > OffenceDateCode"
  ],
  "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > Offence > StartTime": [
    "DeliverRequest > Message > ResultedCaseMessage > Session > Case > Defendant > Offence > BaseOffenceDetails > OffenceTiming > OffenceStart > OffenceStartTime",
    "DeliverRequest > Message > ResultedCaseMessage > Session > Case > Defendant > Offence > BaseOffenceDetails > OffenceTiming > OffenceDateCode"
  ],
  "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > Offence > OffenceEndDate": [
    "DeliverRequest > Message > ResultedCaseMessage > Session > Case > Defendant > Offence > BaseOffenceDetails > OffenceTiming > OffenceEnd > OffenceEndDate"
  ],
  "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > Offence > CourtOffenceSequenceNumber": [
    "DeliverRequest > Message > ResultedCaseMessage > Session > Case > Defendant > Offence > BaseOffenceDetails > OffenceSequenceNumber"
  ],
  "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > Offence > ConvictionDate": [
    "DeliverRequest > Message > ResultedCaseMessage > Session > Case > Defendant > Offence > ConvictionDate",
    "DeliverRequest > Message > ResultedCaseMessage > Session > CourtHearing > Hearing > DateOfHearing",
    "DeliverRequest > Message > ResultedCaseMessage > Session > Case > Defendant > Offence > Result > ResultCode"
  ],
  "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > Result > CJSresultCode": [
    "DeliverRequest > Message > ResultedCaseMessage > Session > Case > Defendant > Offence > Result > ResultCode"
  ],
  "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > Result > ResultHalfLifeHours": [
    "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > Result > CJSresultCode"
  ],
  "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > Result > Urgent": [
    "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > Result > ResultHalfLifeHours"
  ],
  "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > Result > OffenceRemandStatus": [
    "DeliverRequest > Message > ResultedCaseMessage > Session > Case > Defendant > Offence > Result > NextHearing > BailStatusOffence"
  ],
  "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > Result > SourceOrganisation": [
    "DeliverRequest > Message > ResultedCaseMessage > Session > CourtHearing > Hearing > CourtHearingLocation"
  ],
  "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > Result > ConvictingCourt": [
    "DeliverRequest > Message > ResultedCaseMessage > Session > Case > Defendant > Offence > ConvictingCourt"
  ],
  "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > Result > ResultHearingDate": [
    "DeliverRequest > Message > ResultedCaseMessage > Session > Case > Defendant > Offence > ConvictionDate",
    "AnnotatedHearingOutcome > HearingOutcome > Hearing > DateOfHearing"
  ],
  "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > Result > ReasonForOffenceBailConditions": [
    "DeliverRequest > Message > ResultedCaseMessage > Session > Case > Defendant > CourtIndividualDefendant > ReasonForBailConditionsOrCustody"
  ],
  "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > Result > NextHearingDate": [
    "DeliverRequest > Message > ResultedCaseMessage > Session > Case > Defendant > Offence > Result > NextHearing > NextHearingDetails > DateOfHearing",
    "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > Result > CJSresultCode",
    "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > Result > ResultVariableText"
  ],
  "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > Result > NextHearingTime": [
    "DeliverRequest > Message > ResultedCaseMessage > Session > Case > Defendant > Offence > Result > NextHearing > NextHearingDetails > TimeOfHearing"
  ],
  "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > Result > NextResultSourceOrganisation": [
    "DeliverRequest > Message > ResultedCaseMessage > Session > Case > Defendant > Offence > Result > NextHearing > NextHearingDetails > CourtHearingLocation",
    "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > Result > CJSresultCode",
    "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > Result > ResultVariableText"
  ],
  "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > Result > Duration": [
    "DeliverRequest > Message > ResultedCaseMessage > Session > Case > Defendant > Offence > Result > Outcome > Duration"
  ],
  "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > Result > Duration > DurationType": [
    "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > Result > CJSresultCode"
  ],
  "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > Result > Duration > DurationUnit": [
    "DeliverRequest > Message > ResultedCaseMessage > Session > Case > Defendant > Offence > Result > Outcome > Duration > DurationUnit",
    "DeliverRequest > Message > ResultedCaseMessage > Session > Case > Defendant > Offence > Result > Outcome > Duration > SecondaryDurationUnit"
  ],
  "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > Result > Duration > DurationLength": [
    "DeliverRequest > Message > ResultedCaseMessage > Session > Case > Defendant > Offence > Result > Outcome > Duration > DurationValue",
    "DeliverRequest > Message > ResultedCaseMessage > Session > Case > Defendant > Offence > Result > Outcome > Duration > SecondaryDurationValue"
  ],
  "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > Result > DateSpecifiedInResult > Date": [
    "DeliverRequest > Message > ResultedCaseMessage > Session > Case > Defendant > Offence > Result > Outcome > Duration > DurationStartDate",
    "DeliverRequest > Message > ResultedCaseMessage > Session > Case > Defendant > Offence > Result > Outcome > Duration > DurationEndDate"
  ],
  "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > Result > AmountSpecifiedInResult": [
    "DeliverRequest > Message > ResultedCaseMessage > Session > Case > Defendant > Offence > Result > Outcome > ResultAmountSterling"
  ],
  "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > Result > AmountSpecifiedInResult > Amount": [
    "DeliverRequest > Message > ResultedCaseMessage > Session > Case > Defendant > Offence > Result > Outcome > ResultAmountSterling"
  ],
  "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > Result > AmountSpecifiedInResult > DecimalPlaces":
    [
      "DeliverRequest > Message > ResultedCaseMessage > Session > Case > Defendant > Offence > Result > Outcome > ResultAmountSterling"
    ],
  "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > Result > AmountSpecifiedInResult > Type": [
    "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > Result > CJSresultCode"
  ],
  "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > Result > NumberSpecifiedInResult > Number": [
    "DeliverRequest > Message > ResultedCaseMessage > Session > Case > Defendant > Offence > Result > ResultCode",
    "DeliverRequest > Message > ResultedCaseMessage > Session > Case > Defendant > Offence > Result > Outcome > PenaltyPoints",
    "DeliverRequest > Message > ResultedCaseMessage > Session > Case > Defendant > Offence > Result > Outcome > Duration > SecondaryDurationValue",
    "DeliverRequest > Message > ResultedCaseMessage > Session > Case > Defendant > Offence > Result > Outcome > Duration > SecondaryDurationUnit"
  ],
  "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > Result > PleaStatus": [
    "DeliverRequest > Message > ResultedCaseMessage > Session > Case > Defendant > Offence > Plea"
  ],
  "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > Result > Verdict": [
    "DeliverRequest > Message > ResultedCaseMessage > Session > Case > Defendant > Offence > Finding"
  ],
  "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > Result > ModeOfTrialReason": [
    "DeliverRequest > Message > ResultedCaseMessage > Session > Case > Defendant > Offence > ModeOfTrial"
  ],
  "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > Result > ResultVariableText": [
    "DeliverRequest > Message > ResultedCaseMessage > Session > Case > Defendant > Offence > Result > ResultText"
  ],
  "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > Result > WarrantIssueDate": [
    "DeliverRequest > Message > ResultedCaseMessage > Session > CourtHearing > Hearing > DateOfHearing",
    "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > Result > CJSresultCode"
  ],
  "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > Result > NumberOfOffencesTIC": [
    "DeliverRequest > Message > ResultedCaseMessage > Session > Case > Defendant > Offence > Result > ResultText"
  ],
  "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > Result > ResultQualifierVariable > Code": [
    "DeliverRequest > Message > ResultedCaseMessage > Session > Case > Defendant > Offence > Result > ResultCodeQualifier",
    "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > Result > CJSresultCode"
  ],
  "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > Result > BailCondition": [
    "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > Result > ResultQualifierVariable > Code"
  ],
  "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > Result > CourtType": [
    "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > Result > SourceOrganisation"
  ],
  "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > Result > NextCourtType": [
    "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > Result > SourceOrganisation",
    "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > Result > NextHearingDate"
  ],
  "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > Result > ForceOwner": [
    "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > Result > ManualForceOwner",
    "PncQuery > forceStationCode",
    "AnnotatedHearingOutcome > HearingOutcome > Case > PTIURN",
    "AnnotatedHearingOutcome > HearingOutcome > Case > HearingDefendant > ArrestSummonsNumber",
    "AnnotatedHearingOutcome > HearingOutcome > Hearing > CourtHearingLocation"
  ]
}

export default schemaRelations
