import { SET_BY_PROCESSOR } from "../../utils/constants"
import extractAsnFromInputXml from "../../utils/extractAsnFromInputXml"
import type Bichard from "../../utils/world"

export default (_: string, { policeApi }: Bichard) => [
  policeApi.mockAsnQuery({
    matchRegex: "CXE01",
    response: {
      pncCheckName: "HARLOW",
      croNumber: "",
      gmh: "073ENQR000324RENQASIPNCA05A73000017300000120210901130673000001                                             050002326",
      gmt: "000008073ENQR000324R",
      personId: SET_BY_PROCESSOR,
      longPersonUrn: "2021/15K",
      reportId: SET_BY_PROCESSOR,
      asn: "1101ZD0100000410871H",
      ownerCode: "01ZD",
      disposals: [
        {
          crimeOffenceReferenceNumber: "",
          courtCaseId: SET_BY_PROCESSOR,
          courtCaseReference: "21/2732/000012V",
          caseStatusMarker: "impending-prosecution-detail",
          court: {
            courtIdentityType: "code",
            courtCode: "0000"
          },
          offences: [
            {
              acpoOffenceCode: "5:5:8:1",
              courtOffenceSequenceNumber: 1,
              cjsOffenceCode: "TH68010",
              roleQualifiers: [],
              legislationQualifiers: [],
              offenceTic: 0,
              offenceStartDate: "2010-09-25",
              offenceId: "075fb249-bdc5-4636-86b1-d077b2100b89",
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
      pncCheckName: "HARLOW",
      croNumber: "",
      crimeOffenceReferenceNumber: "",
      ownerCode: "01YZ",
      longPersonUrn: "2021/15K",
      courtCaseReference: "21/2732/000012V",
      court: {
        courtIdentityType: "code",
        courtCode: "2576"
      },
      dateOfConviction: "2011-10-01",
      defendant: {
        defendantType: "individual",
        defendantFirstNames: ["ALAN"],
        defendantLastName: "HARLOW"
      },
      offences: [
        {
          courtOffenceSequenceNumber: 1,
          cjsOffenceCode: "TH68010",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-10-01",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 4004,
              disposalEffectiveDate: "2012-02-01"
            }
          ],
          offenceId: "189fbaa6-7ad9-40a1-8958-a94482e3e08d"
        }
      ]
    },
    count: 1
  }),
  policeApi.mockUpdate("CXU01", {
    expectedRequest: {
      pncCheckName: "HARLOW",
      croNumber: "",
      arrestSummonsNumber: "11/01ZD/01/410871H",
      crimeOffenceReferenceNo: "",
      remandLocationFfss: "",
      ownerCode: "01YZ",
      longPersonUrn: "2021/15K",
      remandDate: "2011-10-01",
      appearanceResult: "remanded-on-bail",
      bailConditions: [],
      currentAppearance: {
        court: {
          courtIdentityType: "code",
          courtCode: "2576"
        }
      },
      nextAppearance: {
        date: "2012-02-01",
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
      pncCheckName: "HARLOW",
      croNumber: "",
      gmh: "073ENQR000325RENQASIPNCA05A73000017300000120210901130673000001                                             050002329",
      gmt: "000010073ENQR000325R",
      personId: SET_BY_PROCESSOR,
      longPersonUrn: "2021/15K",
      reportId: SET_BY_PROCESSOR,
      asn: "1101ZD0100000410871H",
      ownerCode: "01ZD",
      disposals: [
        {
          crimeOffenceReferenceNumber: "",
          courtCaseId: SET_BY_PROCESSOR,
          courtCaseReference: "21/2732/000012V",
          caseStatusMarker: "impending-prosecution-detail",
          court: {
            courtIdentityType: "code",
            courtCode: "0000"
          },
          offences: [
            {
              acpoOffenceCode: "5:5:8:1",
              courtOffenceSequenceNumber: 1,
              cjsOffenceCode: "TH68010",
              roleQualifiers: [],
              legislationQualifiers: [],
              plea: "Not Guilty",
              offenceTic: 0,
              offenceStartDate: "2010-09-25",
              offenceId: "77f1dc82-1f76-452b-a903-9f35a308d7dd",
              adjudications: [
                {
                  appearanceNumber: 1,
                  adjudicationId: "326348cf-c809-4902-a01e-67987ab43a8d",
                  disposalDate: "2011-10-01",
                  adjudication: "Guilty"
                }
              ],
              disposalResults: [
                {
                  disposalId: "cebfcc8d-9255-4dd2-8eab-8f4a65524ee6",
                  disposalCode: 4004,
                  disposalEffectiveDate: "2012-02-01",
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
      pncCheckName: "HARLOW",
      croNumber: "",
      crimeOffenceReferenceNumber: "",
      ownerCode: "01YZ",
      longPersonUrn: "2021/15K",
      courtCaseReference: "21/2732/000012V",
      court: {
        courtIdentityType: "code",
        courtCode: "2576"
      },
      appearanceDate: "2011-12-01",
      reasonForAppearance: "Sentence Deferred",
      offences: [
        {
          courtOffenceSequenceNumber: 1,
          cjsOffenceCode: "TH68010",
          disposalResults: [
            {
              disposalCode: 1002,
              disposalDuration: {
                units: "months",
                count: 12
              }
            }
          ],
          offenceId: "ebe791af-0e1d-4f45-ba30-843f788cdf28"
        }
      ]
    },
    count: 1
  })
]
