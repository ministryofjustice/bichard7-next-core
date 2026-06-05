import { SET_BY_PROCESSOR } from "../../utils/constants"
import extractAsnFromInputXml from "../../utils/extractAsnFromInputXml"
import type Bichard from "../../utils/world"

export default (_: string, { policeApi }: Bichard) => [
  policeApi.mockAsnQuery({
    matchRegex: "CXE01",
    response: {
      pncCheckName: "POTTIUS",
      croNumber: "",
      gmh: "073ENQR000328RENQASIPNCA05A73000017300000120210901131573000001                                             050002335",
      gmt: "000008073ENQR000328R",
      personId: SET_BY_PROCESSOR,
      longPersonUrn: "2021/19P",
      reportId: SET_BY_PROCESSOR,
      asn: "1101ZD0100000440769F",
      ownerCode: "01ZD",
      disposals: [
        {
          crimeOffenceReferenceNumber: "",
          courtCaseId: SET_BY_PROCESSOR,
          courtCaseReference: "21/2732/000014X",
          caseStatusMarker: "impending-prosecution-detail",
          court: {
            courtIdentityType: "code",
            courtCode: "0000"
          },
          offences: [
            {
              acpoOffenceCode: "8:7:69:3",
              courtOffenceSequenceNumber: 1,
              cjsOffenceCode: "CJ03510",
              roleQualifiers: [],
              legislationQualifiers: [],
              offenceTic: 0,
              offenceStartDate: "2010-10-01",
              offenceId: "4a6c41fd-4c5e-475e-a6b0-c52bb3ac9093",
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
      pncCheckName: "POTTIUS",
      croNumber: "",
      crimeOffenceReferenceNumber: "",
      ownerCode: "01YZ",
      longPersonUrn: "2021/19P",
      courtCaseReference: "21/2732/000014X",
      court: {
        courtIdentityType: "code",
        courtCode: "2576"
      },
      dateOfConviction: "2011-10-26",
      defendant: {
        defendantType: "individual",
        defendantFirstNames: ["JACOB"],
        defendantLastName: "POTTIUS"
      },
      offences: [
        {
          courtOffenceSequenceNumber: 1,
          cjsOffenceCode: "CJ03510",
          plea: "Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-10-26",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 4027,
              disposalEffectiveDate: "2011-10-28"
            }
          ],
          offenceId: "f782208b-109c-4354-b3aa-7ca9e65b8150"
        }
      ]
    },
    count: 1
  }),
  policeApi.mockUpdate("CXU01", {
    expectedRequest: {
      pncCheckName: "POTTIUS",
      croNumber: "",
      arrestSummonsNumber: "11/01ZD/01/440769F",
      crimeOffenceReferenceNo: "",
      remandLocationFfss: "",
      ownerCode: "01YZ",
      longPersonUrn: "2021/19P",
      remandDate: "2011-10-26",
      appearanceResult: "remanded-on-bail",
      bailConditions: [],
      currentAppearance: {
        court: {
          courtIdentityType: "code",
          courtCode: "2576"
        }
      },
      nextAppearance: {
        date: "2011-10-28",
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
      pncCheckName: "POTTIUS",
      croNumber: "",
      gmh: "073ENQR000329RENQASIPNCA05A73000017300000120210901131573000001                                             050002338",
      gmt: "000010073ENQR000329R",
      personId: SET_BY_PROCESSOR,
      longPersonUrn: "2021/19P",
      reportId: SET_BY_PROCESSOR,
      asn: "1101ZD0100000440769F",
      ownerCode: "01ZD",
      disposals: [
        {
          crimeOffenceReferenceNumber: "",
          courtCaseId: SET_BY_PROCESSOR,
          courtCaseReference: "21/2732/000014X",
          caseStatusMarker: "impending-prosecution-detail",
          court: {
            courtIdentityType: "code",
            courtCode: "0000"
          },
          offences: [
            {
              acpoOffenceCode: "8:7:69:3",
              courtOffenceSequenceNumber: 1,
              cjsOffenceCode: "CJ03510",
              roleQualifiers: [],
              legislationQualifiers: [],
              plea: "Guilty",
              offenceTic: 0,
              offenceStartDate: "2010-10-01",
              offenceId: "f83b2879-605e-42e6-ba6d-9addbd6fa325",
              adjudications: [
                {
                  appearanceNumber: 1,
                  adjudicationId: "1bab8374-eb7e-44e0-a599-74863c6d6bff",
                  disposalDate: "2011-10-26",
                  adjudication: "Guilty"
                }
              ],
              disposalResults: [
                {
                  disposalId: "e53c9362-bbc8-4223-b7f2-b05b129c12da",
                  disposalCode: 4027,
                  disposalEffectiveDate: "2011-10-28",
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
  policeApi.mockUpdate("CXU01", {
    expectedRequest: {
      pncCheckName: "POTTIUS",
      croNumber: "",
      arrestSummonsNumber: "11/01ZD/01/440769F",
      crimeOffenceReferenceNo: "",
      remandLocationFfss: "",
      ownerCode: "01YZ",
      longPersonUrn: "2021/19P",
      remandDate: "2011-10-28",
      appearanceResult: "remanded-on-bail",
      bailConditions: [],
      currentAppearance: {
        court: {
          courtIdentityType: "code",
          courtCode: "2576"
        }
      },
      nextAppearance: {
        date: "2011-10-30",
        court: {
          courtIdentityType: "code",
          courtCode: "2576"
        }
      }
    },
    count: 1
  })
]
