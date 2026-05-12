import { SET_BY_PROCESSOR } from "../../utils/constants"
import extractAsnFromInputXml from "../../utils/extractAsnFromInputXml"
import type Bichard from "../../utils/world"

export default (_: string, { policeApi }: Bichard) => [
  policeApi.mockAsnQuery({
    matchRegex: "CXE01",
    response: {
      pncCheckName: "WELLINGTON",
      croNumber: "",
      gmh: "073ENQR000138RENQASIPNCA05A73000017300000120210831091673000001                                             050001963",
      gmt: "000011073ENQR000138R",
      personId: SET_BY_PROCESSOR,
      personUrn: "2012/18B",
      reportId: SET_BY_PROCESSOR,
      asn: "1200000000000000010X",
      ownerCode: "01ZD",
      disposals: [
        {
          crimeOffenceReferenceNumber: "",
          courtCaseId: SET_BY_PROCESSOR,
          courtCaseReference: "12/2732/000026D",
          caseStatusMarker: "impending-prosecution-detail",
          court: {
            courtIdentityType: "code",
            courtCode: "0000"
          },
          offences: [
            {
              acpoOffenceCode: "1:9:7:1",
              courtOffenceSequenceNumber: 1,
              cjsOffenceCode: "OF61016",
              roleQualifiers: [],
              legislationQualifiers: [],
              offenceTic: 0,
              offenceStartDate: "2009-06-01",
              offenceId: "c684a896-45ab-4beb-8456-1416e8352db5",
              disposalResults: []
            },
            {
              acpoOffenceCode: "11:6:4:1",
              courtOffenceSequenceNumber: 2,
              cjsOffenceCode: "PC53001",
              roleQualifiers: [],
              legislationQualifiers: [],
              offenceTic: 0,
              offenceStartDate: "2009-06-01",
              offenceId: "ed36173a-72a5-472a-9899-675498c1b590",
              disposalResults: []
            }
          ]
        },
        {
          crimeOffenceReferenceNumber: "",
          courtCaseId: SET_BY_PROCESSOR,
          courtCaseReference: "12/2732/000027E",
          caseStatusMarker: "impending-prosecution-detail",
          court: {
            courtIdentityType: "code",
            courtCode: "0000"
          },
          offences: [
            {
              acpoOffenceCode: "5:5:2:1",
              courtOffenceSequenceNumber: 1,
              cjsOffenceCode: "TH68001",
              roleQualifiers: [],
              legislationQualifiers: [],
              offenceTic: 0,
              offenceStartDate: "2009-06-01",
              offenceId: "e5b58420-8e1f-4cc6-aaa6-f74fe9906b83",
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
      pncCheckName: "WELLINGTON",
      croNumber: "",
      crimeOffenceReferenceNumber: "",
      ownerCode: "01YZ",
      personUrn: "2012/18B",
      courtCaseReference: "12/2732/000026D",
      court: {
        courtIdentityType: "code",
        courtCode: "2576"
      },
      dateOfConviction: "2009-10-10",
      defendant: {
        defendantType: "individual",
        defendantFirstNames: ["MARTIN"],
        defendantLastName: "WELLINGTON"
      },
      offences: [
        {
          courtOffenceSequenceNumber: 1,
          cjsOffenceCode: "OF61016",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2009-10-10",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 1002,
              disposalDuration: {
                units: "months",
                count: 12
              }
            }
          ],
          offenceId: "0c26bf0a-4eb8-496c-b768-035360fa97c5"
        },
        {
          courtOffenceSequenceNumber: 2,
          cjsOffenceCode: "PC53001",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2009-10-10",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 1002,
              disposalDuration: {
                units: "months",
                count: 13
              }
            }
          ],
          offenceId: "e406670b-1bcc-4078-b72b-8caed4e76db6"
        }
      ]
    },
    count: 1
  }),
  policeApi.mockAsnQuery({
    matchRegex: "CXE01",
    response: {
      pncCheckName: "WELLINGTON",
      croNumber: "",
      gmh: "073ENQR000139RENQASIPNCA05A73000017300000120210831091673000001                                             050001965",
      gmt: "000015073ENQR000139R",
      personId: SET_BY_PROCESSOR,
      personUrn: "2012/18B",
      reportId: SET_BY_PROCESSOR,
      asn: "1200000000000000010X",
      ownerCode: "01ZD",
      disposals: [
        {
          crimeOffenceReferenceNumber: "",
          courtCaseId: SET_BY_PROCESSOR,
          courtCaseReference: "12/2732/000026D",
          caseStatusMarker: "impending-prosecution-detail",
          court: {
            courtIdentityType: "code",
            courtCode: "0000"
          },
          offences: [
            {
              acpoOffenceCode: "1:9:7:1",
              courtOffenceSequenceNumber: 1,
              cjsOffenceCode: "OF61016",
              roleQualifiers: [],
              legislationQualifiers: [],
              plea: "Not Guilty",
              offenceTic: 0,
              offenceStartDate: "2009-06-01",
              offenceId: "50302ec6-d558-41dd-a58c-c40cf0a59ac3",
              adjudications: [
                {
                  appearanceNumber: 1,
                  adjudicationId: "cde0004f-27e9-4416-bf79-2ca7e699fb61",
                  disposalDate: "2009-10-10",
                  adjudication: "Guilty"
                }
              ],
              disposalResults: [
                {
                  disposalId: "4b8efcc1-fb71-4943-a898-533d807fa4a5",
                  disposalCode: 1002,
                  disposalDuration: {
                    units: "months",
                    count: 12
                  },
                  disposalText: ""
                }
              ]
            },
            {
              acpoOffenceCode: "11:6:4:1",
              courtOffenceSequenceNumber: 2,
              cjsOffenceCode: "PC53001",
              roleQualifiers: [],
              legislationQualifiers: [],
              plea: "Not Guilty",
              offenceTic: 0,
              offenceStartDate: "2009-06-01",
              offenceId: "48d822cf-aa14-499e-abae-abef95d5989e",
              adjudications: [
                {
                  appearanceNumber: 1,
                  adjudicationId: "7c738669-97a3-4bc8-a3ee-a682567aeecc",
                  disposalDate: "2009-10-10",
                  adjudication: "Guilty"
                }
              ],
              disposalResults: [
                {
                  disposalId: "61a7facc-88f2-4bd1-bbac-87c0b9b62936",
                  disposalCode: 1002,
                  disposalDuration: {
                    units: "months",
                    count: 13
                  },
                  disposalText: ""
                }
              ]
            }
          ]
        },
        {
          crimeOffenceReferenceNumber: "",
          courtCaseId: SET_BY_PROCESSOR,
          courtCaseReference: "12/2732/000027E",
          caseStatusMarker: "impending-prosecution-detail",
          court: {
            courtIdentityType: "code",
            courtCode: "0000"
          },
          offences: [
            {
              acpoOffenceCode: "5:5:2:1",
              courtOffenceSequenceNumber: 1,
              cjsOffenceCode: "TH68001",
              roleQualifiers: [],
              legislationQualifiers: [],
              offenceTic: 0,
              offenceStartDate: "2009-06-01",
              offenceId: "076d3e8c-d2ef-46ba-809d-b7d841a34615",
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
  policeApi.mockUpdate("CXU01", {
    expectedRequest: {
      pncCheckName: "WELLINGTON",
      croNumber: "",
      arrestSummonsNumber: "12/0000/00/10X",
      crimeOffenceReferenceNo: "",
      remandLocationFfss: "",
      ownerCode: "01YZ",
      personUrn: "2012/18B",
      remandDate: "2009-10-20",
      appearanceResult: "remanded-on-bail",
      bailConditions: [],
      currentAppearance: {
        court: {
          courtIdentityType: "code",
          courtCode: "2576"
        }
      },
      nextAppearance: {
        date: "2009-11-08",
        court: {
          courtIdentityType: "code",
          courtCode: "2576"
        }
      }
    },
    count: 1
  })
]
