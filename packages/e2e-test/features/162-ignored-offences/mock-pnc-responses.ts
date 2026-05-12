import { SET_BY_PROCESSOR } from "../../utils/constants"
import extractAsnFromInputXml from "../../utils/extractAsnFromInputXml"
import type Bichard from "../../utils/world"

export default (_: string, { policeApi }: Bichard) => [
  policeApi.mockAsnQuery({
    matchRegex: "CXE01",
    response: {
      pncCheckName: "RESULT",
      croNumber: "",
      gmh: "073ENQR000708RENQASIPNCA05A73000017300000120210903102373000001                                             050002907",
      gmt: "000009073ENQR000708R",
      personId: SET_BY_PROCESSOR,
      personUrn: "2021/14J",
      reportId: SET_BY_PROCESSOR,
      asn: "1101ZD0100000410908Y",
      ownerCode: "01ZD",
      disposals: [
        {
          crimeOffenceReferenceNumber: "",
          courtCaseId: SET_BY_PROCESSOR,
          courtCaseReference: "21/2732/000010T",
          caseStatusMarker: "impending-prosecution-detail",
          court: {
            courtIdentityType: "code",
            courtCode: "0000"
          },
          offences: [
            {
              acpoOffenceCode: "",
              courtOffenceSequenceNumber: 1,
              cjsOffenceCode: "RR84042",
              roleQualifiers: [],
              legislationQualifiers: [],
              offenceTic: 0,
              offenceStartDate: "2010-11-28",
              offenceId: "5a77ee0a-e938-41d5-8acf-2c58bac7e0ff",
              disposalResults: []
            },
            {
              acpoOffenceCode: "",
              courtOffenceSequenceNumber: 2,
              cjsOffenceCode: "RR84043",
              roleQualifiers: [],
              legislationQualifiers: [],
              offenceTic: 0,
              offenceStartDate: "2010-11-17",
              offenceId: "b020bcdb-fd59-4ed8-a352-227bde25f4f8",
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
      pncCheckName: "RESULT",
      croNumber: "",
      crimeOffenceReferenceNumber: "",
      ownerCode: "01YZ",
      personUrn: "2021/14J",
      courtCaseReference: "21/2732/000010T",
      court: {
        courtIdentityType: "code",
        courtCode: "2576"
      },
      dateOfConviction: "2011-09-26",
      defendant: {
        defendantType: "individual",
        defendantFirstNames: ["FRANKLIN"],
        defendantLastName: "RESULT"
      },
      offences: [
        {
          courtOffenceSequenceNumber: 1,
          cjsOffenceCode: "RR84042",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-09-26",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 4013,
              disposalEffectiveDate: "2012-01-03"
            }
          ],
          offenceId: "17f060d8-bd65-4484-9b48-634d3bc3d056"
        },
        {
          courtOffenceSequenceNumber: 2,
          cjsOffenceCode: "RR84043",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-09-26",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 4013,
              disposalEffectiveDate: "2012-01-03"
            }
          ],
          offenceId: "24193e1f-9920-43cb-aab6-506d9136ff92"
        }
      ]
    },
    count: 1
  }),
  policeApi.mockUpdate("CXU01", {
    expectedRequest: {
      pncCheckName: "RESULT",
      croNumber: "",
      arrestSummonsNumber: "11/01ZD/01/410908Y",
      crimeOffenceReferenceNo: "",
      remandLocationFfss: "",
      ownerCode: "01YZ",
      personUrn: "2021/14J",
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
        date: "2012-01-03",
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
      pncCheckName: "RESULT",
      croNumber: "",
      gmh: "073ENQR000709RENQASIPNCA05A73000017300000120210903102373000001                                             050002910",
      gmt: "000013073ENQR000709R",
      personId: SET_BY_PROCESSOR,
      personUrn: "2021/14J",
      reportId: SET_BY_PROCESSOR,
      asn: "1101ZD0100000410908Y",
      ownerCode: "01ZD",
      disposals: [
        {
          crimeOffenceReferenceNumber: "",
          courtCaseId: SET_BY_PROCESSOR,
          courtCaseReference: "21/2732/000010T",
          caseStatusMarker: "impending-prosecution-detail",
          court: {
            courtIdentityType: "code",
            courtCode: "0000"
          },
          offences: [
            {
              acpoOffenceCode: "",
              courtOffenceSequenceNumber: 1,
              cjsOffenceCode: "RR84042",
              roleQualifiers: [],
              legislationQualifiers: [],
              plea: "Not Guilty",
              offenceTic: 0,
              offenceStartDate: "2010-11-28",
              offenceId: "30e47c81-cb43-4882-b062-7050cff8a7f1",
              adjudications: [
                {
                  appearanceNumber: 1,
                  adjudicationId: "8410e311-bc14-4cb4-a34a-9b2d936c200c",
                  disposalDate: "2011-09-26",
                  adjudication: "Guilty"
                }
              ],
              disposalResults: [
                {
                  disposalId: "6fc15f72-adb5-45a3-85b5-30f172731f99",
                  disposalCode: 4013,
                  disposalEffectiveDate: "2012-01-03",
                  disposalText: ""
                }
              ]
            },
            {
              acpoOffenceCode: "",
              courtOffenceSequenceNumber: 2,
              cjsOffenceCode: "RR84043",
              roleQualifiers: [],
              legislationQualifiers: [],
              plea: "Not Guilty",
              offenceTic: 0,
              offenceStartDate: "2010-11-17",
              offenceId: "6c9858ad-3c36-478c-8693-cf4cae660951",
              adjudications: [
                {
                  appearanceNumber: 1,
                  adjudicationId: "34c1460c-5790-4e76-aa92-1324b7c3b634",
                  disposalDate: "2011-09-26",
                  adjudication: "Guilty"
                }
              ],
              disposalResults: [
                {
                  disposalId: "d54bc8a7-0c0e-4950-8a8c-14abaa61ca1b",
                  disposalCode: 4013,
                  disposalEffectiveDate: "2012-01-03",
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
      pncCheckName: "RESULT",
      croNumber: "",
      crimeOffenceReferenceNumber: "",
      ownerCode: "01YZ",
      personUrn: "2021/14J",
      courtCaseReference: "21/2732/000010T",
      court: {
        courtIdentityType: "code",
        courtCode: "2576"
      },
      appearanceDate: "2012-01-03",
      reasonForAppearance: "Sentence Deferred",
      offences: [
        {
          courtOffenceSequenceNumber: 1,
          cjsOffenceCode: "RR84042",
          disposalResults: [
            {
              disposalCode: 1002,
              disposalDuration: {
                units: "months",
                count: 12
              }
            }
          ],
          offenceId: "773ba3d7-69cf-42aa-958c-e5f9a475fe9c"
        },
        {
          courtOffenceSequenceNumber: 2,
          cjsOffenceCode: "RR84043",
          disposalResults: [
            {
              disposalCode: 1002,
              disposalDuration: {
                units: "months",
                count: 12
              }
            }
          ],
          offenceId: "0ba6f2da-3d2a-4968-92dc-0c5ce8a14bd9"
        }
      ]
    },
    count: 1
  })
]
