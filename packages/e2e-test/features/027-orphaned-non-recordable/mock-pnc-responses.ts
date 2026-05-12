import { SET_BY_PROCESSOR } from "../../utils/constants"
import extractAsnFromInputXml from "../../utils/extractAsnFromInputXml"
import type Bichard from "../../utils/world"

export default (_: string, { policeApi }: Bichard) => [
  policeApi.mockAsnQuery({
    matchRegex: "CXE01",
    response: {
      pncCheckName: "HOMER",
      croNumber: "",
      gmh: "073ENQR000300RENQASIPNCA05A73000017300000120210901124073000001                                             050002276",
      gmt: "000009073ENQR000300R",
      personId: SET_BY_PROCESSOR,
      personUrn: "21/3X",
      reportId: SET_BY_PROCESSOR,
      asn: "1101ZD0100000410785P",
      ownerCode: "01ZD",
      disposals: [
        {
          crimeOffenceReferenceNumber: "",
          courtCaseId: SET_BY_PROCESSOR,
          courtCaseReference: "21/2732/000003K",
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
              offenceStartDate: "2010-11-28",
              offenceId: "abb84b3e-3e8b-47be-a9c3-7eed94cbf4ed",
              disposalResults: []
            },
            {
              acpoOffenceCode: "12:15:13:1",
              courtOffenceSequenceNumber: 2,
              cjsOffenceCode: "RT88191",
              roleQualifiers: [],
              legislationQualifiers: [],
              offenceTic: 0,
              offenceStartDate: "2010-11-28",
              offenceId: "80cb5cdf-4a0b-4f3b-b952-8d12162f09d0",
              disposalResults: []
            }
          ]
        }
      ]
    },
    expectedRequest: "",
    asn: extractAsnFromInputXml(`${__dirname}/input-message-1.xml`),
    count: 1
  }),
  policeApi.mockUpdate("CXU02", {
    expectedRequest: {
      pncCheckName: "HOMER",
      croNumber: "",
      crimeOffenceReferenceNumber: "",
      ownerCode: "01YZ",
      personUrn: "21/3X",
      courtCaseReference: "21/2732/000003K",
      court: {
        courtIdentityType: "code",
        courtCode: "2576"
      },
      dateOfConviction: "2011-09-26",
      defendant: {
        defendantType: "individual",
        defendantFirstNames: ["HOMER"],
        defendantLastName: "WELLS"
      },
      carryForward: {
        appearanceDate: "2011-10-08",
        court: {
          courtIdentityType: "code",
          courtCode: "2576"
        }
      },
      offences: [
        {
          courtOffenceSequenceNumber: 1,
          cjsOffenceCode: "TH68006",
          plea: "Not Guilty",
          adjudication: "Not Guilty",
          dateOfSentence: "2011-09-26",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 2051
            }
          ],
          offenceId: "abe1be67-91bf-4f2f-9c2b-60b06d84f6b1"
        },
        {
          courtOffenceSequenceNumber: 2,
          cjsOffenceCode: "RT88191",
          plea: "Not Guilty",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 2059
            }
          ],
          offenceId: "17f6da71-340d-4cf6-a08e-ae7c48bdc641"
        }
      ]
    },
    count: 1
  }),
  policeApi.mockUpdate("CXU01", {
    expectedRequest: {
      pncCheckName: "HOMER",
      croNumber: "",
      arrestSummonsNumber: "11/01ZD/01/410785P",
      crimeOffenceReferenceNo: "",
      remandLocationFfss: "",
      ownerCode: "01YZ",
      personUrn: "21/3X",
      remandDate: "2011-09-26",
      appearanceResult: "remanded-on-bail",
      bailConditions: [],
      currentAppearance: {
        court: {
          courtIdentityType: "code",
          courtCode: "2576"
        }
      },
      nextAppearance: {
        date: "2011-10-08",
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
      pncCheckName: "HOMER",
      croNumber: "",
      gmh: "073ENQR000301RENQASIPNCA05A73000017300000120210901124073000001                                             050002279",
      gmt: "000012073ENQR000301R",
      personId: SET_BY_PROCESSOR,
      personUrn: "21/3X",
      reportId: SET_BY_PROCESSOR,
      asn: "1101ZD0100000410785P",
      ownerCode: "01ZD",
      disposals: [
        {
          crimeOffenceReferenceNumber: "",
          courtCaseId: SET_BY_PROCESSOR,
          courtCaseReference: "21/2732/000003K",
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
              plea: "Not Guilty",
              offenceTic: 0,
              offenceStartDate: "2010-11-28",
              offenceId: "9d42eb74-3965-4027-a327-b4c9f5b3e684",
              adjudications: [
                {
                  appearanceNumber: 1,
                  adjudicationId: "940bf92f-2ecd-441e-93f5-81a048f482f8",
                  disposalDate: "2011-09-26",
                  adjudication: "Not Guilty"
                }
              ],
              disposalResults: [
                {
                  disposalId: "c1c88c0b-d79a-4bc0-802a-769624b9b81b",
                  disposalCode: 2051,
                  disposalText: ""
                }
              ]
            }
          ]
        },
        {
          crimeOffenceReferenceNumber: "",
          courtCaseId: SET_BY_PROCESSOR,
          courtCaseReference: "21/2732/000025J",
          caseStatusMarker: "impending-prosecution-detail",
          court: {
            courtIdentityType: "code",
            courtCode: "0000"
          },
          offences: [
            {
              acpoOffenceCode: "12:15:13:1",
              courtOffenceSequenceNumber: 1,
              cjsOffenceCode: "RT88191",
              roleQualifiers: [],
              legislationQualifiers: [],
              offenceTic: 0,
              offenceStartDate: "2010-11-28",
              offenceId: "9fe67d79-5fd1-4177-b722-f42dd5a197bb",
              disposalResults: []
            }
          ]
        }
      ]
    },
    expectedRequest: "",
    asn: extractAsnFromInputXml(`${__dirname}/input-message-2.xml`),
    count: 1
  }),
  policeApi.mockUpdate("CXU02", {
    expectedRequest: {
      pncCheckName: "HOMER",
      croNumber: "",
      crimeOffenceReferenceNumber: "",
      ownerCode: "01YZ",
      personUrn: "21/3X",
      courtCaseReference: "21/2732/000025J",
      court: {
        courtIdentityType: "code",
        courtCode: "2576"
      },
      dateOfConviction: "2011-10-08",
      defendant: {
        defendantType: "individual",
        defendantFirstNames: ["HOMER"],
        defendantLastName: "WELLS"
      },
      offences: [
        {
          courtOffenceSequenceNumber: 1,
          cjsOffenceCode: "RT88191",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-10-08",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 1015,
              disposalFine: {
                amount: 100
              }
            }
          ],
          offenceId: "695467c9-6a37-4daa-bd16-e93f54e4ef8d"
        }
      ]
    },
    count: 1
  })
]
