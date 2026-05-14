import { SET_BY_PROCESSOR } from "../../utils/constants"
import extractAsnFromInputXml from "../../utils/extractAsnFromInputXml"
import type Bichard from "../../utils/world"

export default (_: string, { policeApi }: Bichard) => [
  policeApi.mockAsnQuery({
    matchRegex: "CXE01",
    response: {
      pncCheckName: "SENDEFNEWREM",
      croNumber: "",
      gmh: "073ENQR000314RENQASIPNCA05A73000017300000120210901125773000001                                             050002305",
      gmt: "000010073ENQR000314R",
      personId: SET_BY_PROCESSOR,
      personUrn: "2021/12G",
      reportId: SET_BY_PROCESSOR,
      asn: "1101VK0100000376483E",
      ownerCode: "01VK",
      disposals: [
        {
          crimeOffenceReferenceNumber: "",
          courtCaseId: SET_BY_PROCESSOR,
          courtCaseReference: "21/2812/000002F",
          caseStatusMarker: "impending-prosecution-detail",
          court: {
            courtIdentityType: "code",
            courtCode: "0000"
          },
          offences: [
            {
              acpoOffenceCode: "5:5:5:1",
              courtOffenceSequenceNumber: 1,
              cjsOffenceCode: "TH68006",
              roleQualifiers: [],
              legislationQualifiers: [],
              offenceTic: 0,
              offenceStartDate: "2010-09-01",
              offenceId: "82d6d193-0a42-4beb-9c91-f3ad06e6a463",
              disposalResults: []
            },
            {
              acpoOffenceCode: "5:7:11:10",
              courtOffenceSequenceNumber: 2,
              cjsOffenceCode: "TH68151",
              roleQualifiers: [],
              legislationQualifiers: [],
              offenceTic: 0,
              offenceStartDate: "2010-09-01",
              offenceId: "b868d5f5-6a3e-4a7a-abcb-f4c6e9db46fe",
              disposalResults: []
            },
            {
              acpoOffenceCode: "5:5:8:1",
              courtOffenceSequenceNumber: 3,
              cjsOffenceCode: "TH68010",
              roleQualifiers: [],
              legislationQualifiers: [],
              offenceTic: 0,
              offenceStartDate: "2010-09-01",
              offenceId: "0e0f30d5-7172-4826-b208-ae4c408c1da6",
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
      pncCheckName: "SENDEFNEWREM",
      croNumber: "",
      crimeOffenceReferenceNumber: "",
      ownerCode: "01YZ",
      personUrn: "2021/12G",
      courtCaseReference: "21/2812/000002F",
      court: {
        courtIdentityType: "code",
        courtCode: "2576"
      },
      dateOfConviction: "2010-09-26",
      defendant: {
        defendantType: "individual",
        defendantFirstNames: ["ONECCR"],
        defendantLastName: "SENDEFNEWREM"
      },
      carryForward: {
        appearanceDate: "2010-10-26",
        court: {
          courtIdentityType: "code",
          courtCode: "2576"
        }
      },
      offences: [
        {
          courtOffenceSequenceNumber: 1,
          cjsOffenceCode: "TH68006",
          offenceTic: 0,
          plea: "Not Guilty",
          disposalResults: [
            {
              disposalCode: 2059
            }
          ],
          offenceId: "79747853-b658-408c-8266-0946ae0f6418"
        },
        {
          courtOffenceSequenceNumber: 2,
          cjsOffenceCode: "TH68151",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2010-09-26",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 4011,
              disposalEffectiveDate: "2010-10-26"
            }
          ],
          offenceId: "9809a5cb-d6c9-4761-a33e-d7b78186e60b"
        },
        {
          courtOffenceSequenceNumber: 3,
          cjsOffenceCode: "TH68010",
          offenceTic: 0,
          plea: "Not Guilty",
          disposalResults: [
            {
              disposalCode: 2059
            }
          ],
          offenceId: "d2984de5-777f-4b84-8902-7669f985b2b7"
        }
      ]
    },
    count: 1
  }),
  policeApi.mockUpdate("CXU01", {
    expectedRequest: {
      pncCheckName: "SENDEFNEWREM",
      croNumber: "",
      arrestSummonsNumber: "11/01VK/01/376483E",
      crimeOffenceReferenceNo: "",
      remandLocationFfss: "",
      ownerCode: "01YZ",
      personUrn: "2021/12G",
      remandDate: "2010-09-26",
      appearanceResult: "remanded-on-bail",
      bailConditions: [],
      currentAppearance: {
        court: {
          courtIdentityType: "code",
          courtCode: "2576"
        }
      },
      nextAppearance: {
        date: "2010-10-26",
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
      pncCheckName: "SENDEFNEWREM",
      croNumber: "",
      gmh: "073ENQR000315RENQASIPNCA05A73000017300000120210901125773000001                                             050002308",
      gmt: "000013073ENQR000315R",
      personId: SET_BY_PROCESSOR,
      personUrn: "2021/12G",
      reportId: SET_BY_PROCESSOR,
      asn: "1101VK0100000376483E",
      ownerCode: "01VK",
      disposals: [
        {
          crimeOffenceReferenceNumber: "",
          courtCaseId: SET_BY_PROCESSOR,
          courtCaseReference: "21/2732/000026K",
          caseStatusMarker: "impending-prosecution-detail",
          court: {
            courtIdentityType: "code",
            courtCode: "0000"
          },
          offences: [
            {
              acpoOffenceCode: "5:5:5:1",
              courtOffenceSequenceNumber: 1,
              cjsOffenceCode: "TH68006",
              roleQualifiers: [],
              legislationQualifiers: [],
              offenceTic: 0,
              offenceStartDate: "2010-09-01",
              offenceId: "2e8645d1-818b-46c5-8bf2-1bc15c9de4a9",
              disposalResults: []
            },
            {
              acpoOffenceCode: "5:5:8:1",
              courtOffenceSequenceNumber: 2,
              cjsOffenceCode: "TH68010",
              roleQualifiers: [],
              legislationQualifiers: [],
              offenceTic: 0,
              offenceStartDate: "2010-09-01",
              offenceId: "030d6e20-24d7-4899-9b66-61249b085f98",
              disposalResults: []
            }
          ]
        },
        {
          crimeOffenceReferenceNumber: "",
          courtCaseId: SET_BY_PROCESSOR,
          courtCaseReference: "21/2812/000002F",
          caseStatusMarker: "impending-prosecution-detail",
          court: {
            courtIdentityType: "code",
            courtCode: "0000"
          },
          offences: [
            {
              acpoOffenceCode: "5:7:11:10",
              courtOffenceSequenceNumber: 1,
              cjsOffenceCode: "TH68151",
              roleQualifiers: [],
              legislationQualifiers: [],
              plea: "Not Guilty",
              offenceTic: 0,
              offenceStartDate: "2010-09-01",
              offenceId: "dcffc983-7e32-4dc7-a52d-ca00705e0b7e",
              adjudications: [
                {
                  appearanceNumber: 1,
                  adjudicationId: "d30c0fa5-5d12-4d92-9ede-45b3caabb9e8",
                  disposalDate: "2010-09-26",
                  adjudication: "Guilty"
                }
              ],
              disposalResults: [
                {
                  disposalId: "4bad0e1b-ab33-4320-91e6-34c10298ddd5",
                  disposalCode: 4011,
                  disposalEffectiveDate: "2010-10-26",
                  disposalText: ""
                }
              ]
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
      pncCheckName: "SENDEFNEWREM",
      croNumber: "",
      crimeOffenceReferenceNumber: "",
      ownerCode: "01YZ",
      personUrn: "2021/12G",
      courtCaseReference: "21/2812/000002F",
      court: {
        courtIdentityType: "code",
        courtCode: "2576"
      },
      appearanceDate: "2010-10-26",
      reasonForAppearance: "Sentence Deferred",
      offences: [
        {
          courtOffenceSequenceNumber: 1,
          cjsOffenceCode: "TH68151",
          disposalResults: [
            {
              disposalCode: 1002,
              disposalDuration: {
                units: "months",
                count: 10
              }
            }
          ],
          offenceId: "e8dc05e8-5874-40e1-9b7d-d90ddf18a9be"
        }
      ]
    },
    count: 1
  }),
  policeApi.mockUpdate("CXU01", {
    expectedRequest: {
      pncCheckName: "SENDEFNEWREM",
      croNumber: "",
      arrestSummonsNumber: "11/01VK/01/376483E",
      crimeOffenceReferenceNo: "",
      remandLocationFfss: "",
      ownerCode: "01YZ",
      personUrn: "2021/12G",
      remandDate: "2010-10-26",
      appearanceResult: "remanded-on-bail",
      bailConditions: [],
      currentAppearance: {
        court: {
          courtIdentityType: "code",
          courtCode: "2576"
        }
      },
      nextAppearance: {
        date: "2010-11-26",
        court: {
          courtIdentityType: "code",
          courtCode: "2576"
        }
      }
    },
    count: 1
  })
]
