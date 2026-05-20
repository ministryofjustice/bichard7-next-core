import { SET_BY_PROCESSOR } from "../../utils/constants"
import extractAsnFromInputXml from "../../utils/extractAsnFromInputXml"
import type Bichard from "../../utils/world"

export default (_: string, { policeApi }: Bichard) => [
  policeApi.mockAsnQuery({
    matchRegex: "CXE01",
    response: {
      pncCheckName: "POSTADJUDICA",
      croNumber: "",
      gmh: "073ENQR000724RENQASIPNCA05A73000017300000120210903102673000001                                             050002942",
      gmt: "000008073ENQR000724R",
      personId: SET_BY_PROCESSOR,
      personUrn: "2021/26X",
      reportId: SET_BY_PROCESSOR,
      asn: "1201ZD0100000448750E",
      ownerCode: "01ZD",
      disposals: [
        {
          crimeOffenceReferenceNumber: "",
          courtCaseId: SET_BY_PROCESSOR,
          courtCaseReference: "21/2732/000020D",
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
              offenceTic: 0,
              offenceStartDate: "2006-11-28",
              offenceId: "e9325d81-1322-4520-a530-109587cd1f5c",
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
      pncCheckName: "POSTADJUDICA",
      croNumber: "",
      crimeOffenceReferenceNumber: "",
      ownerCode: "01YZ",
      personUrn: "2021/26X",
      courtCaseReference: "21/2732/000020D",
      court: {
        courtIdentityType: "code",
        courtCode: "2576"
      },
      dateOfConviction: "2011-09-26",
      defendant: {
        defendantType: "individual",
        defendantFirstNames: ["PASSAWAY"],
        defendantLastName: "POSTADJUDICATION"
      },
      offences: [
        {
          courtOffenceSequenceNumber: 1,
          cjsOffenceCode: "TH68151",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-09-26",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 4047,
              disposalEffectiveDate: "2011-10-26"
            }
          ],
          offenceId: "6bcc95de-ac46-4f5c-9d92-aaa8268ea0cd"
        }
      ]
    },
    count: 1
  }),
  policeApi.mockUpdate("CXU01", {
    expectedRequest: {
      pncCheckName: "POSTADJUDICA",
      croNumber: "",
      arrestSummonsNumber: "12/01ZD/01/448750E",
      crimeOffenceReferenceNo: "",
      remandLocationFfss: "",
      ownerCode: "01YZ",
      personUrn: "2021/26X",
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
        date: "2011-10-26",
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
      pncCheckName: "POSTADJUDICA",
      croNumber: "",
      gmh: "073ENQR000725RENQASIPNCA05A73000017300000120210903102673000001                                             050002945",
      gmt: "000010073ENQR000725R",
      personId: SET_BY_PROCESSOR,
      personUrn: "2021/26X",
      reportId: SET_BY_PROCESSOR,
      asn: "1201ZD0100000448750E",
      ownerCode: "01ZD",
      disposals: [
        {
          crimeOffenceReferenceNumber: "",
          courtCaseId: SET_BY_PROCESSOR,
          courtCaseReference: "21/2732/000020D",
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
              offenceStartDate: "2006-11-28",
              offenceId: "c6b864bc-9650-411f-946b-6f518e676def",
              adjudications: [
                {
                  appearanceNumber: 1,
                  adjudicationId: "10aa28cf-af88-40af-b394-f3426b7d8a0b",
                  disposalDate: "2011-09-26",
                  adjudication: "Guilty"
                }
              ],
              disposalResults: [
                {
                  disposalId: "8f747f59-b585-44dc-b2af-32ec971aba13",
                  disposalCode: 4047,
                  disposalEffectiveDate: "2011-10-26",
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
      pncCheckName: "POSTADJUDICA",
      croNumber: "",
      crimeOffenceReferenceNumber: "",
      ownerCode: "01YZ",
      personUrn: "2021/26X",
      courtCaseReference: "21/2732/000020D",
      court: {
        courtIdentityType: "code",
        courtCode: "2576"
      },
      appearanceDate: "2011-10-26",
      reasonForAppearance: "Sentence Deferred",
      offences: [
        {
          courtOffenceSequenceNumber: 1,
          cjsOffenceCode: "TH68151",
          disposalResults: [
            {
              disposalCode: 2065
            }
          ],
          offenceId: "fc7707c6-ac0d-4a2c-a26d-c8edafa71df0"
        }
      ]
    },
    count: 1
  })
]
