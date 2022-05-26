import { XMLBuilder } from "fast-xml-parser"
import type { AhoParsedXml, Br7Case, Br7Hearing, Br7Offence } from "src/types/AhoParsedXml"
import type { AnnotatedHearingOutcome, Case, Hearing, Offence } from "src/types/AnnotatedHearingOutcome"

const mapAhoOffencesToXml = (offences: Offence[]): Br7Offence[] => {
  const xmlOffences: Br7Offence[] = []

  for (const offence of offences) {
    xmlOffences.push({
      "ds:CriminalProsecutionReference": {
        "ds:DefendantOrOffender": {
          "ds:Year": Number(offence.CriminalProsecutionReference.DefendantOrOffender?.Year),
          "ds:OrganisationUnitIdentifierCode": {
            "ds:SecondLevelCode":
              offence.CriminalProsecutionReference.DefendantOrOffender?.OrganisationUnitIdentifierCode
                .SecondLevelCode ?? "",
            "ds:ThirdLevelCode":
              offence.CriminalProsecutionReference.DefendantOrOffender?.OrganisationUnitIdentifierCode.ThirdLevelCode ??
              "",
            "ds:BottomLevelCode":
              offence.CriminalProsecutionReference.DefendantOrOffender?.OrganisationUnitIdentifierCode
                .BottomLevelCode ?? "",
            "ds:OrganisationUnitCode":
              offence.CriminalProsecutionReference.DefendantOrOffender?.OrganisationUnitIdentifierCode
                .OrganisationUnitCode ?? "",
            "@_SchemaVersion": "2.0"
          },
          "ds:DefendantOrOffenderSequenceNumber": Number(
            offence.CriminalProsecutionReference.DefendantOrOffender?.DefendantOrOffenderSequenceNumber
          ),
          "ds:CheckDigit": offence.CriminalProsecutionReference.DefendantOrOffender?.CheckDigit ?? ""
        },
        "ds:OffenceReason": { "ds:OffenceCode": { "ds:ActOrSource": "TH", "ds:Year": 68, "ds:Reason": 59 } },
        "@_SchemaVersion": "2.0"
      },
      "ds:OffenceCategory": { "#text": "CE", "@_Literal": "Either Way" },
      "ds:ArrestDate": offence.ArrestDate ? offence.ArrestDate.toISOString() : "",
      "ds:ChargeDate": offence.ChargeDate ? offence.ChargeDate.toISOString() : "",
      "ds:ActualOffenceDateCode": { "#text": Number(offence.ActualOffenceDateCode), "@_Literal": "between" },
      "ds:ActualOffenceStartDate": { "ds:StartDate": offence.ActualOffenceStartDate.StartDate.toISOString() },
      "ds:ActualOffenceEndDate": {
        "ds:EndDate": offence.ActualOffenceEndDate.EndDate ? offence.ActualOffenceEndDate.EndDate.toISOString() : ""
      },
      "ds:LocationOfOffence": offence.LocationOfOffence,
      "ds:OffenceTitle": offence.OffenceTitle ?? "",
      "ds:ActualOffenceWording": offence.ActualOffenceWording,
      "ds:RecordableOnPNCindicator": { "#text": "Y", "@_Literal": "Yes" },
      "ds:NotifiableToHOindicator": { "#text": "Y", "@_Literal": "Yes" },
      "ds:HomeOfficeClassification": offence.HomeOfficeClassification ?? "",
      "ds:ConvictionDate": offence.ConvictionDate ? offence.ConvictionDate.toISOString() : "",
      "br7:CommittedOnBail": { "#text": "D", "@_Literal": "Don't Know" },
      "br7:CourtOffenceSequenceNumber": 1,
      "br7:AddedByTheCourt": { "#text": "Y", "@_Literal": "Yes" },
      "br7:Result": {
        "ds:CJSresultCode": 1044,
        "ds:SourceOrganisation": {
          "ds:TopLevelCode": "B",
          "ds:SecondLevelCode": "4",
          "ds:ThirdLevelCode": "KO",
          "ds:BottomLevelCode": "0",
          "ds:OrganisationUnitCode": "B04KO00",
          "@_SchemaVersion": "2.0"
        },
        "ds:CourtType": "MCA",
        "ds:ResultHearingType": { "#text": "OTHER", "@_Literal": "Other" },
        "ds:ResultHearingDate": "2008-05-02",
        "ds:PleaStatus": { "#text": "NG", "@_Literal": "Not Guilty" },
        "ds:ModeOfTrialReason": { "#text": "NOMOT", "@_Literal": "No Mode of Trial" },
        "ds:ResultVariableText": "result text for result code 1044",
        "ds:ResultHalfLifeHours": 72,
        "br7:PNCDisposalType": 1044,
        "br7:ResultClass": "Sentence",
        "br7:ConvictingCourt": 1375,
        "@_hasError": "false",
        "@_SchemaVersion": "2.0"
      },
      "@_hasError": "false",
      "@_SchemaVersion": "4.0"
    })
  }

  return xmlOffences
}

const mapAhoCaseToXml = (c: Case): Br7Case => ({
  "ds:PTIURN": "01KY0370016",
  "ds:PreChargeDecisionIndicator": { "#text": "N", "@_Literal": "No" },
  "br7:CourtReference": { "ds:MagistratesCourtReference": "01KY0370016" },
  "br7:RecordableOnPNCindicator": { "#text": "Y", "@_Literal": "Yes" },
  "br7:ForceOwner": {
    "ds:SecondLevelCode": "1",
    "ds:ThirdLevelCode": "0",
    "ds:BottomLevelCode": "0",
    "ds:OrganisationUnitCode": "10000",
    "@_SchemaVersion": "2.0"
  },
  "br7:HearingDefendant": {
    "br7:ArrestSummonsNumber": { "#text": "0873B71200000012001C", "@_Error": "HO100304" },
    "br7:DefendantDetail": {
      "br7:PersonName": {
        "ds:Title": "Mr",
        "ds:GivenName": { "#text": "NUALA", "@_NameSequence": "1" },
        "ds:FamilyName": { "#text": "MALLON", "@_NameSequence": "1" }
      },
      "br7:GeneratedPNCFilename": "MALLON/NUALA",
      "br7:BirthDate": "1998-08-06",
      "br7:Gender": { "#text": 1, "@_Literal": "male" }
    },
    "br7:Address": {
      "ds:AddressLine1": "person addline1",
      "ds:AddressLine2": "person addline2",
      "ds:AddressLine3": "person addline3"
    },
    "br7:RemandStatus": { "#text": "UB", "@_Literal": "Unconditional Bail" },
    "br7:CourtPNCIdentifier": "2001/0000837Z",
    "br7:Offence": mapAhoOffencesToXml(c.HearingDefendant.Offence),
    "@_hasError": "true"
  },
  "@_hasError": "false",
  "@_SchemaVersion": "4.0"
})

const mapAhoHearingToXml = (hearing: Hearing): Br7Hearing => ({
  "ds:CourtHearingLocation": {
    "ds:TopLevelCode": hearing.CourtHearingLocation.TopLevelCode,
    "ds:SecondLevelCode": hearing.CourtHearingLocation.SecondLevelCode,
    "ds:ThirdLevelCode": hearing.CourtHearingLocation.ThirdLevelCode,
    "ds:BottomLevelCode": hearing.CourtHearingLocation.BottomLevelCode,
    "ds:OrganisationUnitCode": hearing.CourtHearingLocation.OrganisationUnitCode,
    "@_SchemaVersion": "2.0"
  },
  "ds:DateOfHearing": hearing.DateOfHearing.toISOString(),
  "ds:TimeOfHearing": hearing.TimeOfHearing,
  "ds:HearingLanguage": { "#text": hearing.HearingLanguage, "@_Literal": "Don't Know" },
  "ds:HearingDocumentationLanguage": { "#text": hearing.HearingDocumentationLanguage, "@_Literal": "Don't Know" },
  "ds:DefendantPresentAtHearing": { "#text": hearing.DefendantPresentAtHearing, "@_Literal": "Yes" },
  "br7:SourceReference": {
    "br7:DocumentName": hearing.SourceReference.DocumentName,
    "br7:UniqueID": hearing.SourceReference.UniqueID,
    "br7:DocumentType": hearing.SourceReference.DocumentType
  },
  "br7:CourtType": { "#text": hearing.CourtType ?? "", "@_Literal": "MC adult" },
  "br7:CourtHouseCode": hearing.CourtHouseCode,
  "br7:CourtHouseName": hearing.CourtHouseName ?? "",
  "@_hasError": "false",
  "@_SchemaVersion": "4.0"
})

const mapAhoToXml = (aho: AnnotatedHearingOutcome): AhoParsedXml => {
  return {
    "?xml": { "@_version": "1.0", "@_encoding": "UTF-8", "@_standalone": "yes" },
    "br7:AnnotatedHearingOutcome": {
      "br7:HearingOutcome": {
        "br7:Hearing": mapAhoHearingToXml(aho.AnnotatedHearingOutcome.HearingOutcome.Hearing),
        "br7:Case": mapAhoCaseToXml(aho.AnnotatedHearingOutcome.HearingOutcome.Case)
      },
      "br7:HasError": true,
      CXE01: {
        FSC: { "@_FSCode": "", "@_IntfcUpdateType": "K" },
        IDS: { "@_CRONumber": "", "@_Checkname": "PERKINS", "@_IntfcUpdateType": "K", "@_PNCID": "2009/0000231M" },
        CourtCases: {
          CourtCase: {
            CCR: { "@_CourtCaseRefNo": "09/0473/000231R", "@_CrimeOffenceRefNo": "", "@_IntfcUpdateType": "K" },
            Offences: {
              Offence: [
                {
                  COF: {
                    "@_ACPOOffenceCode": "1:9:2:1",
                    "@_CJSOffenceCode": "OF61102",
                    "@_IntfcUpdateType": "K",
                    "@_OffEndDate": "12052006",
                    "@_OffEndTime": "",
                    "@_OffStartDate": "12052006",
                    "@_OffStartTime": "",
                    "@_OffenceQualifier1": "",
                    "@_OffenceQualifier2": "",
                    "@_OffenceTitle": "Section 47 - assault    occasioning actual bodily harm",
                    "@_ReferenceNumber": "001"
                  },
                  ADJ: {
                    "@_Adjudication1": "GUILTY",
                    "@_DateOfSentence": "12112008",
                    "@_IntfcUpdateType": "I",
                    "@_OffenceTICNumber": "0000",
                    "@_Plea": "NO PLEA TAKEN",
                    "@_WeedFlag": ""
                  },
                  DISList: {
                    DIS: {
                      "@_IntfcUpdateType": "I",
                      "@_QtyDate": "",
                      "@_QtyDuration": "M3",
                      "@_QtyMonetaryValue": "",
                      "@_QtyUnitsFined": "",
                      "@_Qualifiers": "",
                      "@_Text": "",
                      "@_Type": "1115"
                    }
                  }
                },
                {
                  COF: {
                    "@_ACPOOffenceCode": "7:1:7:1",
                    "@_CJSOffenceCode": "PU86002",
                    "@_IntfcUpdateType": "K",
                    "@_OffEndDate": "12052006",
                    "@_OffEndTime": "",
                    "@_OffStartDate": "12052006",
                    "@_OffStartTime": "",
                    "@_OffenceQualifier1": "",
                    "@_OffenceQualifier2": "",
                    "@_OffenceTitle": "Public order - violent disorder",
                    "@_ReferenceNumber": "002"
                  },
                  ADJ: {
                    "@_Adjudication1": "GUILTY",
                    "@_DateOfSentence": "12112008",
                    "@_IntfcUpdateType": "I",
                    "@_OffenceTICNumber": "0000",
                    "@_Plea": "NO PLEA TAKEN",
                    "@_WeedFlag": ""
                  },
                  DISList: {
                    DIS: {
                      "@_IntfcUpdateType": "I",
                      "@_QtyDate": "",
                      "@_QtyDuration": "M3",
                      "@_QtyMonetaryValue": "",
                      "@_QtyUnitsFined": "",
                      "@_Qualifiers": "",
                      "@_Text": "",
                      "@_Type": "1115"
                    }
                  }
                }
              ]
            }
          }
        }
      },
      "br7:PNCQueryDate": "2010-12-02",
      "@_xmlns:ds": "http://schemas.cjse.gov.uk/datastandards/2006-10",
      "@_xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
      "@_xmlns:br7": "http://schemas.cjse.gov.uk/datastandards/BR7/2007-12"
    }
  } as AhoParsedXml
}

const convertAhoToXml = (hearingOutcome: AnnotatedHearingOutcome): string => {
  const options = {
    ignoreAttributes: false,
    suppressEmptyNode: true,
    processEntities: false
  }

  const builder = new XMLBuilder(options)
  const xmlAho = mapAhoToXml(hearingOutcome)
  const xml = builder.build(xmlAho)

  return xml
}

export default convertAhoToXml
