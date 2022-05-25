import { XMLBuilder } from "fast-xml-parser"
import type { AhoParsedXml } from "src/types/AhoParsedXml"
import type { AnnotatedHearingOutcome } from "src/types/AnnotatedHearingOutcome"

/* 

  Xml Aho from file -> JSON -> Types -> Easy street

*/

const mapAhoToXml = (_: AnnotatedHearingOutcome): AhoParsedXml => {
  return {
    "?xml": { "@_version": "1.0", "@_encoding": "UTF-8", "@_standalone": "yes" },
    "br7:AnnotatedHearingOutcome": {
      "br7:HearingOutcome": {
        "br7:Hearing": {
          "ds:CourtHearingLocation": {
            "ds:TopLevelCode": "B",
            "ds:SecondLevelCode": "4",
            "ds:ThirdLevelCode": "KO",
            "ds:BottomLevelCode": "0",
            "ds:OrganisationUnitCode": "B04KO00",
            "@_SchemaVersion": "2.0"
          },
          "ds:DateOfHearing": "2008-05-07",
          "ds:TimeOfHearing": "15:01",
          "ds:HearingLanguage": { "#text": "D", "@_Literal": "Don't Know" },
          "ds:HearingDocumentationLanguage": { "#text": "D", "@_Literal": "Don't Know" },
          "ds:DefendantPresentAtHearing": { "#text": "Y", "@_Literal": "Yes" },
          "br7:SourceReference": {
            "br7:DocumentName": "SPI NUALA MALLON",
            "br7:UniqueID": "02-12-201014:35ID:414d51204252375f514d202020202020cf67174c013b0320",
            "br7:DocumentType": "SPI Case Result"
          },
          "br7:CourtType": { "#text": "MCA", "@_Literal": "MC adult" },
          "br7:CourtHouseCode": 2014,
          "br7:CourtHouseName": "Magistrates' Courts Lancashire Preston",
          "@_hasError": "false",
          "@_SchemaVersion": "4.0"
        },
        "br7:Case": {
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
            "br7:Offence": [
              {
                "ds:CriminalProsecutionReference": {
                  "ds:DefendantOrOffender": {
                    "ds:Year": 8,
                    "ds:OrganisationUnitIdentifierCode": {
                      "ds:SecondLevelCode": "73",
                      "ds:ThirdLevelCode": "B7",
                      "ds:BottomLevelCode": "12",
                      "ds:OrganisationUnitCode": "73B712",
                      "@_SchemaVersion": "2.0"
                    },
                    "ds:DefendantOrOffenderSequenceNumber": 12001,
                    "ds:CheckDigit": "C"
                  },
                  "ds:OffenceReason": { "ds:OffenceCode": { "ds:ActOrSource": "TH", "ds:Year": 68, "ds:Reason": 59 } },
                  "@_SchemaVersion": "2.0"
                },
                "ds:OffenceCategory": { "#text": "CE", "@_Literal": "Either Way" },
                "ds:ArrestDate": "2008-04-06",
                "ds:ChargeDate": "2008-04-09",
                "ds:ActualOffenceDateCode": { "#text": 4, "@_Literal": "between" },
                "ds:ActualOffenceStartDate": { "ds:StartDate": "2002-04-12" },
                "ds:ActualOffenceEndDate": { "ds:EndDate": "2002-04-12" },
                "ds:LocationOfOffence": "offence 1 location",
                "ds:OffenceTitle": "Obtain property by deception",
                "ds:ActualOffenceWording": "long text talking about offence 1",
                "ds:RecordableOnPNCindicator": { "#text": "Y", "@_Literal": "Yes" },
                "ds:NotifiableToHOindicator": { "#text": "Y", "@_Literal": "Yes" },
                "ds:HomeOfficeClassification": "053/01",
                "ds:ConvictionDate": "2008-05-02",
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
              }
            ],
            "@_hasError": "true"
          },
          "@_hasError": "false",
          "@_SchemaVersion": "4.0"
        }
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
    suppressEmptyNode: true
  }

  const builder = new XMLBuilder(options)
  const xml = builder.build(mapAhoToXml(hearingOutcome))

  return xml
}

export default convertAhoToXml
