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
              SecondLevelCode: "01",
              ThirdLevelCode: "EF",
              BottomLevelCode: "01",
              OrganisationUnitCode: "B01EF01"
            },
            DateOfHearing: new Date("2011-09-26"),
            TimeOfHearing: "10:00",
            HearingLanguage: "D",
            HearingDocumentationLanguage: "D",
            DefendantPresentAtHearing: "A",
            SourceReference: {
              DocumentName: "SPI TRPRFOUR SEXOFFENCE",
              UniqueID: "CID-8bc6ee0a-46ac-4a0e-b9be-b03e3b041415",
              DocumentType: "SPI Case Result"
            },
            CourtType: "MCA",
            CourtHouseCode: 2576,
            CourtHouseName: "London Croydon"
          },
          Case: {
            PTIURN: "01ZD0303208",
            PreChargeDecisionIndicator: false,
            RecordableOnPNCindicator: true,
            CourtReference: {
              MagistratesCourtReference: "01ZD0303208"
            },
            ForceOwner: {
              BottomLevelCode: "00",
              OrganisationUnitCode: "01ZD00",
              SecondLevelCode: "01",
              ThirdLevelCode: "ZD",
              TopLevelCode: undefined
            },
            HearingDefendant: {
              ArrestSummonsNumber: "1101ZD0100000448754K",
              CourtPNCIdentifier: undefined,
              DefendantDetail: {
                PersonName: {
                  FamilyName: "SEXOFFENCE",
                  GivenName: ["TRPRFOUR"],
                  Title: "Mr"
                },
                Gender: "1",
                GeneratedPNCFilename: "SEXOFFENCE/TRPRFOUR",
                BirthDate: new Date("1948-11-11")
              },
              Address: {
                AddressLine1: "Scenario1 Address Line 1",
                AddressLine2: "Scenario1 Address Line 2",
                AddressLine3: "Scenario1 Address Line 3"
              },
              BailConditions: [""],
              Offence: [
                {
                  ActualOffenceDateCode: "1",
                  ActualOffenceStartDate: { StartDate: new Date("2010-11-28") },
                  ActualOffenceEndDate: undefined,
                  ActualOffenceWording: "Attempt to rape a girl aged 13 / 14 / 15 / years of age - SOA 2003.",
                  ArrestDate: new Date("2010-12-01"),
                  ChargeDate: new Date("2010-12-02"),
                  CommittedOnBail: "D",
                  ConvictionDate: new Date("2011-09-26"),
                  CourtOffenceSequenceNumber: 1,
                  CriminalProsecutionReference: {
                    DefendantOrOffender: {
                      Year: "11",
                      CheckDigit: "K",
                      DefendantOrOffenderSequenceNumber: "00000448754",
                      OrganisationUnitIdentifierCode: {
                        BottomLevelCode: "01",
                        OrganisationUnitCode: "01ZD01",
                        SecondLevelCode: "01",
                        ThirdLevelCode: "ZD",
                        TopLevelCode: undefined
                      }
                    },
                    OffenceReason: {
                      OffenceCode: {
                        ActOrSource: "",
                        FullCode: "001A",
                        Qualifier: "A",
                        Reason: "001",
                        __type: "NonMatchingOffenceCode"
                      },
                      __type: "NationalOffenceReason"
                    }
                  },
                  HomeOfficeClassification: "019/11",
                  LocationOfOffence: "Kingston High Street",
                  NotifiableToHOindicator: true,
                  OffenceCategory: "CI",
                  OffenceTitle: "Attempt to rape a girl aged 13 / 14 / 15 years of age - SOA 2003",
                  RecordableOnPNCindicator: true,
                  Result: [
                    {
                      CJSresultCode: 3078,
                      ConvictingCourt: undefined,
                      CourtType: "MCA",
                      DateSpecifiedInResult: [],
                      Duration: [],
                      ModeOfTrialReason: "SUM",
                      PNCDisposalType: 3078,
                      PleaStatus: CjsPlea.NotGuilty,
                      ResultApplicableQualifierCode: [],
                      ResultClass: "Judgement with final result",
                      ResultHalfLifeHours: 72,
                      ResultHearingDate: new Date("2011-09-26"),
                      ResultHearingType: "OTHER",
                      ResultQualifierVariable: [],
                      ResultVariableText: "Travel Restriction Order",
                      SourceOrganisation: {
                        BottomLevelCode: "01",
                        OrganisationUnitCode: "B01EF01",
                        SecondLevelCode: "01",
                        ThirdLevelCode: "EF",
                        TopLevelCode: "B"
                      }
                    }
                  ]
                },
                {
                  ActualOffenceDateCode: "1",
                  ActualOffenceStartDate: { StartDate: new Date("2010-11-28") },
                  ActualOffenceEndDate: undefined,
                  ActualOffenceWording: "Rape of a Female",
                  ArrestDate: new Date("2010-12-01"),
                  ChargeDate: new Date("2010-12-02"),
                  CommittedOnBail: "D",
                  ConvictionDate: new Date("2011-09-26"),
                  CourtOffenceSequenceNumber: 2,
                  CriminalProsecutionReference: {
                    DefendantOrOffender: {
                      Year: "11",
                      CheckDigit: "K",
                      DefendantOrOffenderSequenceNumber: "00000448754",
                      OrganisationUnitIdentifierCode: {
                        BottomLevelCode: "01",
                        OrganisationUnitCode: "01ZD01",
                        SecondLevelCode: "01",
                        ThirdLevelCode: "ZD",
                        TopLevelCode: undefined
                      }
                    },
                    OffenceReason: {
                      OffenceCode: {
                        ActOrSource: "",
                        FullCode: "001",
                        Qualifier: undefined,
                        Reason: "001",
                        __type: "NonMatchingOffenceCode"
                      },
                      __type: "NationalOffenceReason"
                    }
                  },
                  HomeOfficeClassification: "019/07",
                  LocationOfOffence: "Kingston High Street",
                  NotifiableToHOindicator: true,
                  OffenceCategory: "CI",
                  OffenceTitle: "Rape a girl aged 13 / 14 / 15 - SOA 2003",
                  RecordableOnPNCindicator: true,
                  Result: [
                    {
                      CJSresultCode: 3052,
                      ConvictingCourt: undefined,
                      CourtType: "MCA",
                      DateSpecifiedInResult: [],
                      Duration: [],
                      ModeOfTrialReason: "SUM",
                      PNCDisposalType: 3052,
                      PleaStatus: CjsPlea.NotGuilty,
                      ResultApplicableQualifierCode: [],
                      ResultClass: "Judgement with final result",
                      ResultHalfLifeHours: 24,
                      ResultHearingDate: new Date("2011-09-26"),
                      ResultHearingType: "OTHER",
                      ResultQualifierVariable: [],
                      ResultVariableText: "defendant must never be allowed out",
                      SourceOrganisation: {
                        BottomLevelCode: "01",
                        OrganisationUnitCode: "B01EF01",
                        SecondLevelCode: "01",
                        ThirdLevelCode: "EF",
                        TopLevelCode: "B"
                      }
                    }
                  ]
                },
                {
                  ActualOffenceDateCode: "1",
                  ActualOffenceStartDate: { StartDate: new Date("2010-11-28") },
                  ActualOffenceEndDate: undefined,
                  ActualOffenceWording: "Use a motor vehicle without third party insurance.",
                  ArrestDate: new Date("2010-12-01"),
                  ChargeDate: new Date("2010-12-02"),
                  CommittedOnBail: "D",
                  ConvictionDate: new Date("2011-09-26"),
                  CourtOffenceSequenceNumber: 3,
                  CriminalProsecutionReference: {
                    DefendantOrOffender: {
                      Year: "11",
                      CheckDigit: "K",
                      DefendantOrOffenderSequenceNumber: "00000448754",
                      OrganisationUnitIdentifierCode: {
                        BottomLevelCode: "01",
                        OrganisationUnitCode: "01ZD01",
                        SecondLevelCode: "01",
                        ThirdLevelCode: "ZD",
                        TopLevelCode: undefined
                      }
                    },
                    OffenceReason: {
                      OffenceCode: {
                        ActOrSource: "",
                        FullCode: "191",
                        Qualifier: undefined,
                        Reason: "191",
                        __type: "NonMatchingOffenceCode"
                      },
                      __type: "NationalOffenceReason"
                    }
                  },
                  HomeOfficeClassification: "809/01",
                  LocationOfOffence: "Kingston High Street",
                  NotifiableToHOindicator: false,
                  OffenceCategory: "CM",
                  OffenceTitle: "Use a motor vehicle on a road / public place without third party insurance",
                  RecordableOnPNCindicator: false,
                  Result: [
                    {
                      CJSresultCode: 1015,
                      ConvictingCourt: undefined,
                      CourtType: "MCA",
                      DateSpecifiedInResult: [],
                      Duration: [],
                      ModeOfTrialReason: "SUM",
                      PNCDisposalType: 1015,
                      PleaStatus: CjsPlea.NotGuilty,
                      ResultApplicableQualifierCode: [],
                      ResultClass: "Judgement with final result",
                      ResultHalfLifeHours: 72,
                      ResultHearingDate: new Date("2011-09-26"),
                      ResultHearingType: "OTHER",
                      ResultQualifierVariable: [],
                      ResultVariableText: "Fined 100.",
                      SourceOrganisation: {
                        BottomLevelCode: "01",
                        OrganisationUnitCode: "B01EF01",
                        SecondLevelCode: "01",
                        ThirdLevelCode: "EF",
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
