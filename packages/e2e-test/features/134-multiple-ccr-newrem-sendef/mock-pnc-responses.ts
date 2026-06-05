import { SET_BY_PROCESSOR } from "../../utils/constants"
import extractAsnFromInputXml from "../../utils/extractAsnFromInputXml"
import type Bichard from "../../utils/world"

export default (_: string, { policeApi }: Bichard) => [
  policeApi.mockAsnQuery({
    matchRegex: "CXE01",
    response: {
      pncCheckName: "MARTIN",
      croNumber: "",
      gmh: "073ENQR000137RENQASIPNCA05A73000017300000120210827102873000001                                             050002039",
      gmt: "000013073ENQR000137R",
      personId: SET_BY_PROCESSOR,
      longPersonUrn: "2009/479G",
      reportId: SET_BY_PROCESSOR,
      asn: "0900000000000020003G",
      ownerCode: "01VK",
      disposals: [
        {
          crimeOffenceReferenceNumber: "",
          courtCaseId: SET_BY_PROCESSOR,
          courtCaseReference: "09/0428/000446G",
          caseStatusMarker: "impending-prosecution-detail",
          court: {
            courtIdentityType: "code",
            courtCode: "0000"
          },
          offences: [
            {
              acpoOffenceCode: "3:1:1:1",
              courtOffenceSequenceNumber: 1,
              cjsOffenceCode: "CD71015",
              roleQualifiers: [],
              legislationQualifiers: [],
              offenceTic: 0,
              offenceStartDate: "2009-06-01",
              offenceId: "311a7bf3-ec08-41c2-8a36-97452482c03e",
              disposalResults: []
            }
          ]
        },
        {
          crimeOffenceReferenceNumber: "",
          courtCaseId: SET_BY_PROCESSOR,
          courtCaseReference: "09/0413/000447K",
          caseStatusMarker: "impending-prosecution-detail",
          court: {
            courtIdentityType: "code",
            courtCode: "0000"
          },
          offences: [
            {
              acpoOffenceCode: "5:3:7:1",
              courtOffenceSequenceNumber: 1,
              cjsOffenceCode: "TH68037",
              roleQualifiers: [],
              legislationQualifiers: [],
              offenceTic: 0,
              offenceStartDate: "2009-06-01",
              offenceId: "f9db2361-072b-4aea-ba1f-79eb1ccc6a7e",
              disposalResults: []
            }
          ]
        },
        {
          crimeOffenceReferenceNumber: "",
          courtCaseId: SET_BY_PROCESSOR,
          courtCaseReference: "09/0418/000448U",
          caseStatusMarker: "impending-prosecution-detail",
          court: {
            courtIdentityType: "code",
            courtCode: "0000"
          },
          offences: [
            {
              acpoOffenceCode: "5:6:1:1",
              courtOffenceSequenceNumber: 1,
              cjsOffenceCode: "TH68072",
              roleQualifiers: [],
              legislationQualifiers: [],
              offenceTic: 0,
              offenceStartDate: "2009-06-01",
              offenceId: "6a6579ed-22d8-4eb7-ba2f-0eddc74e5070",
              disposalResults: []
            },
            {
              acpoOffenceCode: "5:8:1:1",
              courtOffenceSequenceNumber: 2,
              cjsOffenceCode: "TH68081",
              roleQualifiers: [],
              legislationQualifiers: [],
              offenceTic: 0,
              offenceStartDate: "2009-06-01",
              offenceId: "4bfa94f1-a959-4cb2-9f01-5a4244928fdc",
              disposalResults: []
            }
          ]
        }
      ]
    },
    asn: extractAsnFromInputXml(`${__dirname}/input-message-1.xml`),
    expectedRequest: "",
    count: 1
  }),
  policeApi.mockUpdate("CXU02", {
    expectedRequest: {
      pncCheckName: "MARTIN",
      croNumber: "",
      crimeOffenceReferenceNumber: "",
      ownerCode: "01YZ",
      longPersonUrn: "2009/479G",
      courtCaseReference: "09/0413/000447K",
      court: {
        courtIdentityType: "code",
        courtCode: "2576"
      },
      dateOfConviction: "2009-10-01",
      defendant: {
        defendantType: "individual",
        defendantFirstNames: ["ROGER"],
        defendantLastName: "MARTIN"
      },
      offences: [
        {
          courtOffenceSequenceNumber: 1,
          cjsOffenceCode: "TH68037",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2009-10-01",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 4011,
              disposalEffectiveDate: "2009-11-01"
            }
          ],
          offenceId: "dff08f0d-9c07-48d4-89bc-26764acdf293"
        }
      ]
    },
    count: 1
  }),
  policeApi.mockUpdate("CXU01", {
    expectedRequest: {
      pncCheckName: "MARTIN",
      croNumber: "",
      arrestSummonsNumber: "09/0000/00/20003G",
      crimeOffenceReferenceNo: "",
      remandLocationFfss: "",
      ownerCode: "01YZ",
      longPersonUrn: "2009/479G",
      remandDate: "2009-10-01",
      appearanceResult: "remanded-on-bail",
      bailConditions: [],
      currentAppearance: {
        court: {
          courtIdentityType: "code",
          courtCode: "2576"
        }
      },
      nextAppearance: {
        date: "2009-11-01",
        court: {
          courtIdentityType: "code",
          courtCode: "2576"
        }
      }
    },
    count: 1
  }),
  policeApi.mockAsnQuery({
    matchRegex: "CXE01",
    response: {
      pncCheckName: "MARTIN",
      croNumber: "",
      gmh: "073ENQR000138RENQASIPNCA05A73000017300000120210827102873000001                                             050002042",
      gmt: "000015073ENQR000138R",
      personId: SET_BY_PROCESSOR,
      longPersonUrn: "2009/479G",
      reportId: SET_BY_PROCESSOR,
      asn: "0900000000000020003G",
      ownerCode: "01VK",
      disposals: [
        {
          crimeOffenceReferenceNumber: "",
          courtCaseId: SET_BY_PROCESSOR,
          courtCaseReference: "09/0428/000446G",
          caseStatusMarker: "impending-prosecution-detail",
          court: {
            courtIdentityType: "code",
            courtCode: "0000"
          },
          offences: [
            {
              acpoOffenceCode: "3:1:1:1",
              courtOffenceSequenceNumber: 1,
              cjsOffenceCode: "CD71015",
              roleQualifiers: [],
              legislationQualifiers: [],
              offenceTic: 0,
              offenceStartDate: "2009-06-01",
              offenceId: "ed8c5230-f576-42c4-9959-3ed299c53345",
              disposalResults: []
            }
          ]
        },
        {
          crimeOffenceReferenceNumber: "",
          courtCaseId: SET_BY_PROCESSOR,
          courtCaseReference: "09/0413/000447K",
          caseStatusMarker: "impending-prosecution-detail",
          court: {
            courtIdentityType: "code",
            courtCode: "0000"
          },
          offences: [
            {
              acpoOffenceCode: "5:3:7:1",
              courtOffenceSequenceNumber: 1,
              cjsOffenceCode: "TH68037",
              roleQualifiers: [],
              legislationQualifiers: [],
              plea: "Not Guilty",
              offenceTic: 0,
              offenceStartDate: "2009-06-01",
              offenceId: "2744b0bf-07eb-4819-9b60-0205997abbb9",
              adjudications: [
                {
                  appearanceNumber: 1,
                  adjudicationId: "9eae204d-7acb-43aa-826f-52a883f9a3c4",
                  disposalDate: "2009-10-01",
                  adjudication: "Guilty"
                }
              ],
              disposalResults: [
                {
                  disposalId: "e1f3abd5-0a1b-464a-b592-7f22f0452af3",
                  disposalCode: 4011,
                  disposalEffectiveDate: "2009-11-01",
                  disposalText: ""
                }
              ]
            }
          ]
        },
        {
          crimeOffenceReferenceNumber: "",
          courtCaseId: SET_BY_PROCESSOR,
          courtCaseReference: "09/0418/000448U",
          caseStatusMarker: "impending-prosecution-detail",
          court: {
            courtIdentityType: "code",
            courtCode: "0000"
          },
          offences: [
            {
              acpoOffenceCode: "5:6:1:1",
              courtOffenceSequenceNumber: 1,
              cjsOffenceCode: "TH68072",
              roleQualifiers: [],
              legislationQualifiers: [],
              offenceTic: 0,
              offenceStartDate: "2009-06-01",
              offenceId: "558d66dc-b8ba-4493-a15f-e6c1c6236369",
              disposalResults: []
            },
            {
              acpoOffenceCode: "5:8:1:1",
              courtOffenceSequenceNumber: 2,
              cjsOffenceCode: "TH68081",
              roleQualifiers: [],
              legislationQualifiers: [],
              offenceTic: 0,
              offenceStartDate: "2009-06-01",
              offenceId: "4d627fe5-8ab3-4d9c-b693-9b77e9afa928",
              disposalResults: []
            }
          ]
        }
      ]
    },
    asn: extractAsnFromInputXml(`${__dirname}/input-message-2.xml`),
    expectedRequest: "",
    count: 1
  }),
  policeApi.mockUpdate("CXU04", {
    expectedRequest: {
      pncCheckName: "MARTIN",
      croNumber: "",
      crimeOffenceReferenceNumber: "",
      ownerCode: "01YZ",
      longPersonUrn: "2009/479G",
      courtCaseReference: "09/0413/000447K",
      court: {
        courtIdentityType: "code",
        courtCode: "2576"
      },
      appearanceDate: "2009-11-01",
      reasonForAppearance: "Sentence Deferred",
      offences: [
        {
          courtOffenceSequenceNumber: 1,
          cjsOffenceCode: "TH68037",
          disposalResults: [
            {
              disposalCode: 1002,
              disposalDuration: {
                units: "months",
                count: 12
              }
            }
          ],
          offenceId: "aa49c170-f966-4079-890a-7f1778ee0e57"
        }
      ]
    },
    count: 1
  }),
  policeApi.mockUpdate("CXU01", {
    expectedRequest: {
      pncCheckName: "MARTIN",
      croNumber: "",
      arrestSummonsNumber: "09/0000/00/20003G",
      crimeOffenceReferenceNo: "",
      remandLocationFfss: "",
      ownerCode: "01YZ",
      longPersonUrn: "2009/479G",
      remandDate: "2009-11-01",
      appearanceResult: "remanded-on-bail",
      bailConditions: [],
      currentAppearance: {
        court: {
          courtIdentityType: "code",
          courtCode: "2576"
        }
      },
      nextAppearance: {
        date: "2009-12-01",
        court: {
          courtIdentityType: "code",
          courtCode: "2576"
        }
      }
    },
    count: 1
  })
]
