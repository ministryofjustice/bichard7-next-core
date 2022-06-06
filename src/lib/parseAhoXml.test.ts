import fs from "fs"
import "jest-xml-matcher"
import type { AnnotatedHearingOutcome } from "src/types/AnnotatedHearingOutcome"
import { CjsPlea } from "src/types/Plea"
import parseAhoXml from "./parseAhoXml"

describe("parseAhoXml", () => {
  it("converts XML to Aho", () => {
    const inputXml = fs.readFileSync("test-data/AnnotatedHO1.xml").toString()
    const parsedAho = parseAhoXml(inputXml)
    const expectedAho: AnnotatedHearingOutcome = {
      AnnotatedHearingOutcome: {
        HearingOutcome: {
          Hearing: {
            CourtHearingLocation: {
              TopLevelCode: "B",
              SecondLevelCode: "04",
              ThirdLevelCode: "KO",
              BottomLevelCode: "00",
              OrganisationUnitCode: "B04KO00"
            },
            DateOfHearing: new Date("2008-05-07"),
            TimeOfHearing: "15:01",
            HearingLanguage: "D",
            HearingDocumentationLanguage: "D",
            DefendantPresentAtHearing: "Y",
            SourceReference: {
              DocumentName: "SPI NUALA MALLON",
              UniqueID: "02-12-201014:35ID:414d51204252375f514d202020202020cf67174c013b0320",
              DocumentType: "SPI Case Result"
            },
            CourtType: "MCA",
            CourtHouseCode: 2014,
            CourtHouseName: "Magistrates' Courts Lancashire Preston"
          },
          Case: {
            PTIURN: "01KY0370016",
            PreChargeDecisionIndicator: false,
            RecordableOnPNCindicator: true,
            CourtReference: {
              MagistratesCourtReference: "01KY0370016"
            },
            ForceOwner: {
              BottomLevelCode: "00",
              OrganisationUnitCode: "010000",
              SecondLevelCode: "01",
              ThirdLevelCode: "00",
              TopLevelCode: undefined
            },
            HearingDefendant: {
              ArrestSummonsNumber: "1101ZD0100000410770Y",
              CourtPNCIdentifier: "2001/0000837Z",
              DefendantDetail: {
                PersonName: {
                  FamilyName: "MALLON",
                  GivenName: ["NUALA"],
                  Title: "Mr"
                },
                Gender: "1",
                GeneratedPNCFilename: "MALLON/NUALA",
                BirthDate: new Date("1998-08-06")
              },
              Address: {
                AddressLine1: "person addline1",
                AddressLine2: "person addline2",
                AddressLine3: "person addline3"
              },
              BailConditions: [""],
              Offence: [
                {
                  ActualOffenceDateCode: "4",
                  ActualOffenceStartDate: { StartDate: new Date("2002-04-12") },
                  ActualOffenceEndDate: { EndDate: new Date("2002-04-12") },
                  ActualOffenceWording: "long text talking about offence 1",
                  ArrestDate: new Date("2008-04-06"),
                  ChargeDate: new Date("2008-04-09"),
                  CommittedOnBail: "D",
                  ConvictionDate: new Date("2008-05-02"),
                  CourtOffenceSequenceNumber: 1,
                  CriminalProsecutionReference: {
                    DefendantOrOffender: {
                      Year: "08",
                      CheckDigit: "C",
                      DefendantOrOffenderSequenceNumber: "00000012001",
                      OrganisationUnitIdentifierCode: {
                        BottomLevelCode: "12",
                        OrganisationUnitCode: "73B712",
                        SecondLevelCode: "73",
                        ThirdLevelCode: "B7",
                        TopLevelCode: undefined
                      }
                    }
                  },
                  HomeOfficeClassification: "053/01",
                  LocationOfOffence: "offence 1 location",
                  NotifiableToHOindicator: true,
                  OffenceCategory: "CE",
                  OffenceTitle: "Obtain property by deception",
                  RecordableOnPNCindicator: true,
                  Result: [
                    {
                      CJSresultCode: 1044,
                      ConvictingCourt: "1375",
                      CourtType: "MCA",
                      DateSpecifiedInResult: [],
                      Duration: [],
                      ModeOfTrialReason: "NOMOT",
                      PNCDisposalType: 1044,
                      PleaStatus: CjsPlea.NotGuilty,
                      ResultApplicableQualifierCode: [],
                      ResultClass: "Sentence",
                      ResultHalfLifeHours: 72,
                      ResultHearingDate: new Date("2008-05-02"),
                      ResultHearingType: "OTHER",
                      ResultQualifierVariable: [],
                      ResultVariableText: "result text for result code 1044",
                      SourceOrganisation: {
                        BottomLevelCode: "00",
                        OrganisationUnitCode: "B04KO00",
                        SecondLevelCode: "04",
                        ThirdLevelCode: "KO",
                        TopLevelCode: "B"
                      }
                    }
                  ]
                },
                {
                  ActualOffenceDateCode: "4",
                  ActualOffenceStartDate: { StartDate: new Date("2002-04-12") },
                  ActualOffenceEndDate: { EndDate: new Date("2002-04-12") },
                  ActualOffenceWording: "long text talking about offence 2",
                  ArrestDate: new Date("2008-04-06"),
                  ChargeDate: new Date("2008-04-09"),
                  CommittedOnBail: "D",
                  ConvictionDate: new Date("2008-05-02"),
                  CourtOffenceSequenceNumber: 2,
                  CriminalProsecutionReference: {
                    DefendantOrOffender: {
                      Year: "08",
                      CheckDigit: "C",
                      DefendantOrOffenderSequenceNumber: "00000012001",
                      OrganisationUnitIdentifierCode: {
                        BottomLevelCode: "12",
                        OrganisationUnitCode: "73B712",
                        SecondLevelCode: "73",
                        ThirdLevelCode: "B7",
                        TopLevelCode: undefined
                      }
                    }
                  },
                  HomeOfficeClassification: "043/00",
                  LocationOfOffence: "offence 2 location",
                  NotifiableToHOindicator: true,
                  OffenceCategory: "CE",
                  OffenceTitle: "Abstract / use without authority electricity",
                  RecordableOnPNCindicator: true,
                  Result: [
                    {
                      CJSresultCode: 1044,
                      ConvictingCourt: "1375",
                      CourtType: "MCA",
                      DateSpecifiedInResult: [],
                      Duration: [],
                      ModeOfTrialReason: "NOMOT",
                      PNCDisposalType: 1044,
                      PleaStatus: CjsPlea.NotGuilty,
                      ResultApplicableQualifierCode: [],
                      ResultClass: "Sentence",
                      ResultHalfLifeHours: 72,
                      ResultHearingDate: new Date("2008-05-02"),
                      ResultHearingType: "OTHER",
                      ResultQualifierVariable: [],
                      ResultVariableText: "result text for result code 1044",
                      SourceOrganisation: {
                        BottomLevelCode: "00",
                        OrganisationUnitCode: "B04KO00",
                        SecondLevelCode: "04",
                        ThirdLevelCode: "KO",
                        TopLevelCode: "B"
                      }
                    }
                  ]
                },
                {
                  ActualOffenceDateCode: "4",
                  ActualOffenceStartDate: { StartDate: new Date("2002-04-12") },
                  ActualOffenceEndDate: { EndDate: new Date("2002-04-12") },
                  ActualOffenceWording: "long text talking about offence 3",
                  ArrestDate: new Date("2008-04-06"),
                  ChargeDate: new Date("2008-04-09"),
                  CommittedOnBail: "D",
                  ConvictionDate: new Date("2008-05-02"),
                  CourtOffenceSequenceNumber: 3,
                  CriminalProsecutionReference: {
                    DefendantOrOffender: {
                      Year: "08",
                      CheckDigit: "C",
                      DefendantOrOffenderSequenceNumber: "00000012001",
                      OrganisationUnitIdentifierCode: {
                        BottomLevelCode: "12",
                        OrganisationUnitCode: "73B712",
                        SecondLevelCode: "73",
                        ThirdLevelCode: "B7",
                        TopLevelCode: undefined
                      }
                    }
                  },
                  HomeOfficeClassification: "054/01",
                  LocationOfOffence: "offence 3 location",
                  NotifiableToHOindicator: true,
                  OffenceCategory: "CE",
                  OffenceTitle: "Receive stolen goods - Theft Act 1968",
                  RecordableOnPNCindicator: true,
                  Result: [
                    {
                      CJSresultCode: 1044,
                      ConvictingCourt: "1375",
                      CourtType: "MCA",
                      DateSpecifiedInResult: [],
                      Duration: [],
                      ModeOfTrialReason: "NOMOT",
                      PNCDisposalType: 1044,
                      PleaStatus: CjsPlea.NotGuilty,
                      ResultApplicableQualifierCode: [],
                      ResultClass: "Sentence",
                      ResultHalfLifeHours: 72,
                      ResultHearingDate: new Date("2008-05-02"),
                      ResultHearingType: "OTHER",
                      ResultQualifierVariable: [],
                      ResultVariableText: "result text for result code 1044",
                      SourceOrganisation: {
                        BottomLevelCode: "00",
                        OrganisationUnitCode: "B04KO00",
                        SecondLevelCode: "04",
                        ThirdLevelCode: "KO",
                        TopLevelCode: "B"
                      }
                    }
                  ]
                },
                {
                  ActualOffenceDateCode: "4",
                  ActualOffenceStartDate: { StartDate: new Date("2002-04-12") },
                  ActualOffenceEndDate: { EndDate: new Date("2002-04-12") },
                  ActualOffenceWording: "long text talking about offence 4",
                  ArrestDate: new Date("2008-04-06"),
                  ChargeDate: new Date("2008-04-09"),
                  CommittedOnBail: "D",
                  ConvictionDate: new Date("2008-05-02"),
                  CourtOffenceSequenceNumber: 4,
                  CriminalProsecutionReference: {
                    DefendantOrOffender: {
                      Year: "08",
                      CheckDigit: "C",
                      DefendantOrOffenderSequenceNumber: "00000012001",
                      OrganisationUnitIdentifierCode: {
                        BottomLevelCode: "12",
                        OrganisationUnitCode: "73B712",
                        SecondLevelCode: "73",
                        ThirdLevelCode: "B7",
                        TopLevelCode: undefined
                      }
                    }
                  },
                  HomeOfficeClassification: "092/31",
                  LocationOfOffence: "offence 4 location",
                  NotifiableToHOindicator: true,
                  OffenceCategory: "CE",
                  OffenceTitle: "Concerned in supply of heroin",
                  RecordableOnPNCindicator: true,
                  Result: [
                    {
                      CJSresultCode: 1044,
                      ConvictingCourt: "1375",
                      CourtType: "MCA",
                      DateSpecifiedInResult: [],
                      Duration: [],
                      ModeOfTrialReason: "NOMOT",
                      PNCDisposalType: 1044,
                      PleaStatus: CjsPlea.NotGuilty,
                      ResultApplicableQualifierCode: [],
                      ResultClass: "Sentence",
                      ResultHalfLifeHours: 72,
                      ResultHearingDate: new Date("2008-05-02"),
                      ResultHearingType: "OTHER",
                      ResultQualifierVariable: [],
                      ResultVariableText: "result text for result code 1044",
                      SourceOrganisation: {
                        BottomLevelCode: "00",
                        OrganisationUnitCode: "B04KO00",
                        SecondLevelCode: "04",
                        ThirdLevelCode: "KO",
                        TopLevelCode: "B"
                      }
                    }
                  ]
                },
                {
                  ActualOffenceDateCode: "4",
                  ActualOffenceStartDate: { StartDate: new Date("2002-04-12") },
                  ActualOffenceEndDate: { EndDate: new Date("2002-04-12") },
                  ActualOffenceWording: "long text talking about offence 5",
                  ArrestDate: new Date("2008-04-06"),
                  ChargeDate: new Date("2008-04-09"),
                  CommittedOnBail: "D",
                  ConvictionDate: new Date("2008-05-02"),
                  CourtOffenceSequenceNumber: 5,
                  CriminalProsecutionReference: {
                    DefendantOrOffender: {
                      Year: "08",
                      CheckDigit: "C",
                      DefendantOrOffenderSequenceNumber: "00000012001",
                      OrganisationUnitIdentifierCode: {
                        BottomLevelCode: "12",
                        OrganisationUnitCode: "73B712",
                        SecondLevelCode: "73",
                        ThirdLevelCode: "B7",
                        TopLevelCode: undefined
                      }
                    }
                  },
                  HomeOfficeClassification: "092/51",
                  LocationOfOffence: "offence 5 location",
                  NotifiableToHOindicator: true,
                  OffenceCategory: "CE",
                  OffenceTitle: "Possess a class A controlled drug - heroin",
                  RecordableOnPNCindicator: true,
                  Result: [
                    {
                      CJSresultCode: 1044,
                      ConvictingCourt: "1375",
                      CourtType: "MCA",
                      DateSpecifiedInResult: [],
                      Duration: [],
                      ModeOfTrialReason: "NOMOT",
                      PNCDisposalType: 1044,
                      PleaStatus: CjsPlea.NotGuilty,
                      ResultApplicableQualifierCode: [],
                      ResultClass: "Sentence",
                      ResultHalfLifeHours: 72,
                      ResultHearingDate: new Date("2008-05-02"),
                      ResultHearingType: "OTHER",
                      ResultQualifierVariable: [],
                      ResultVariableText: "result text for result code 1044",
                      SourceOrganisation: {
                        BottomLevelCode: "00",
                        OrganisationUnitCode: "B04KO00",
                        SecondLevelCode: "04",
                        ThirdLevelCode: "KO",
                        TopLevelCode: "B"
                      }
                    }
                  ]
                }
              ],
              RemandStatus: "UB"
            }
          }
        }
      }
    }

    expect(parsedAho).toEqual(expectedAho)
  })
})
