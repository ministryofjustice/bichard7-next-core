import { SET_BY_PROCESSOR } from "../../utils/constants"
import extractAsnFromInputXml from "../../utils/extractAsnFromInputXml"
import type Bichard from "../../utils/world"

export default (_: string, { policeApi }: Bichard) => [
  policeApi.mockAsnQuery({
    matchRegex: "CXE01",
    response: {
      pncCheckName: "JIMBOBJONES",
      croNumber: "",
      gmh: "073ENQR000302RENQASIPNCA05A73000017300000120210901124473000001                                             050002281",
      gmt: "000008073ENQR000302R",
      personId: SET_BY_PROCESSOR,
      personUrn: "2021/4Y",
      reportId: SET_BY_PROCESSOR,
      asn: "1201ZD0100000448696w",
      ownerCode: "01ZD",
      disposals: [
        {
          crimeOffenceReferenceNumber: "",
          courtCaseId: SET_BY_PROCESSOR,
          courtCaseReference: "21/2732/000004L",
          caseStatusMarker: "impending-prosecution-detail",
          court: {
            courtIdentityType: "code",
            courtCode: "0000"
          },
          offences: [
            {
              acpoOffenceCode: "12:15:16:1",
              courtOffenceSequenceNumber: 1,
              cjsOffenceCode: "RT88007",
              roleQualifiers: [],
              legislationQualifiers: [],
              offenceTic: 0,
              offenceStartDate: "2010-11-28",
              offenceId: "aa7a87d7-1bdf-4469-854e-41b97ac29259",
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
      pncCheckName: "JIMBOBJONES",
      croNumber: "",
      crimeOffenceReferenceNumber: "",
      ownerCode: "01YZ",
      personUrn: "2021/4Y",
      courtCaseReference: "21/2732/000004L",
      court: {
        courtIdentityType: "code",
        courtCode: "1910"
      },
      dateOfConviction: "2011-09-26",
      defendant: {
        defendantType: "individual",
        defendantFirstNames: ["BOBBY"],
        defendantLastName: "JIMBOBJONES"
      },
      offences: [
        {
          courtOffenceSequenceNumber: 1,
          cjsOffenceCode: "RT88007",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-09-26",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 3096
            },
            {
              disposalCode: 4047,
              disposalEffectiveDate: "2011-10-26"
            }
          ],
          offenceId: "bdc8d0bb-7d31-4195-8639-d1fac76115c4"
        }
      ]
    },
    count: 1
  }),
  policeApi.mockUpdate("CXU01", {
    expectedRequest: {
      pncCheckName: "JIMBOBJONES",
      croNumber: "",
      arrestSummonsNumber: "12/01ZD/01/448696W",
      crimeOffenceReferenceNo: "",
      remandLocationFfss: "",
      ownerCode: "01YZ",
      personUrn: "2021/4Y",
      remandDate: "2011-09-26",
      appearanceResult: "adjourned",
      bailConditions: [],
      currentAppearance: {
        court: {
          courtIdentityType: "code",
          courtCode: "1910"
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
      pncCheckName: "JIMBOBJONES",
      croNumber: "",
      gmh: "073ENQR000303RENQASIPNCA05A73000017300000120210901124573000001                                             050002284",
      gmt: "000011073ENQR000303R",
      personId: SET_BY_PROCESSOR,
      personUrn: "2021/4Y",
      reportId: SET_BY_PROCESSOR,
      asn: "1201ZD0100000448696w",
      ownerCode: "01ZD",
      disposals: [
        {
          crimeOffenceReferenceNumber: "",
          courtCaseId: SET_BY_PROCESSOR,
          courtCaseReference: "21/2732/000004L",
          caseStatusMarker: "impending-prosecution-detail",
          court: {
            courtIdentityType: "code",
            courtCode: "0000"
          },
          offences: [
            {
              acpoOffenceCode: "12:15:16:1",
              courtOffenceSequenceNumber: 1,
              cjsOffenceCode: "RT88007",
              roleQualifiers: [],
              legislationQualifiers: [],
              plea: "Not Guilty",
              offenceTic: 0,
              offenceStartDate: "2010-11-28",
              offenceId: "4c9f8080-a6c4-45a8-854e-809f273181ff",
              adjudications: [
                {
                  appearanceNumber: 1,
                  adjudicationId: "b79693be-b5be-469e-bd50-30286f01c98e",
                  disposalDate: "2011-09-26",
                  adjudication: "Guilty"
                }
              ],
              disposalResults: [
                {
                  disposalId: "d890d507-ec68-471d-902a-0f6ed95312d5",
                  disposalCode: 3096,
                  disposalText: ""
                },
                {
                  disposalId: "25352a36-13c0-49da-8874-47bbf63c5f6c",
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
      pncCheckName: "JIMBOBJONES",
      croNumber: "",
      crimeOffenceReferenceNumber: "",
      ownerCode: "01YZ",
      personUrn: "2021/4Y",
      courtCaseReference: "21/2732/000004L",
      court: {
        courtIdentityType: "code",
        courtCode: "1910"
      },
      appearanceDate: "2011-10-26",
      reasonForAppearance: "Sentence Deferred",
      offences: [
        {
          courtOffenceSequenceNumber: 1,
          cjsOffenceCode: "RT88007",
          disposalResults: [
            {
              disposalCode: 3050
            },
            {
              disposalCode: 3070,
              disposalDuration: {
                units: "months",
                count: 12
              },
              disposalText: "FROM 26/09/11"
            }
          ],
          offenceId: "18267c83-7397-4f6a-9a03-78dd24590686"
        }
      ]
    },
    count: 1
  })
]
