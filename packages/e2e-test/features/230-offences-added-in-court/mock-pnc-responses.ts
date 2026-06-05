import { SET_BY_PROCESSOR } from "../../utils/constants"
import extractAsnFromInputXml from "../../utils/extractAsnFromInputXml"
import type Bichard from "../../utils/world"

export default (_: string, { policeApi }: Bichard) => [
  policeApi.mockAsnQuery({
    matchRegex: "CXE01",
    response: {
      pncCheckName: "ADDEDOFFENCE",
      croNumber: "",
      gmh: "073ENQR000718RENQASIPNCA05A73000017300000120210903102573000001                                             050002928",
      gmt: "000008073ENQR000718R",
      personId: SET_BY_PROCESSOR,
      longPersonUrn: "2021/21R",
      reportId: SET_BY_PROCESSOR,
      asn: "1101ZD0100000445117G",
      ownerCode: "01ZD",
      disposals: [
        {
          crimeOffenceReferenceNumber: "",
          courtCaseId: SET_BY_PROCESSOR,
          courtCaseReference: "21/2732/000015Y",
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
              offenceId: "8675fb6c-4564-4908-b808-074d8d451256",
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
      pncCheckName: "ADDEDOFFENCE",
      croNumber: "",
      crimeOffenceReferenceNumber: "",
      ownerCode: "01YZ",
      longPersonUrn: "2021/21R",
      courtCaseReference: "21/2732/000015Y",
      court: {
        courtIdentityType: "code",
        courtCode: "2576"
      },
      dateOfConviction: "2011-10-01",
      defendant: {
        defendantType: "individual",
        defendantFirstNames: ["PNCADJ"],
        defendantLastName: "ADDEDOFFENCEJWFTWO"
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
              disposalEffectiveDate: "2012-01-01"
            }
          ],
          offenceId: "65c4d31f-f7cf-4fcd-93c4-38a868eb5281"
        }
      ]
    },
    count: 1
  }),
  policeApi.mockUpdate("CXU01", {
    expectedRequest: {
      pncCheckName: "ADDEDOFFENCE",
      croNumber: "",
      arrestSummonsNumber: "11/01ZD/01/445117G",
      crimeOffenceReferenceNo: "",
      remandLocationFfss: "",
      ownerCode: "01YZ",
      longPersonUrn: "2021/21R",
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
        date: "2012-01-01",
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
      pncCheckName: "ADDEDOFFENCE",
      croNumber: "",
      gmh: "073ENQR000719RENQASIPNCA05A73000017300000120210903102573000001                                             050002931",
      gmt: "000010073ENQR000719R",
      personId: SET_BY_PROCESSOR,
      longPersonUrn: "2021/21R",
      reportId: SET_BY_PROCESSOR,
      asn: "1101ZD0100000445117G",
      ownerCode: "01ZD",
      disposals: [
        {
          crimeOffenceReferenceNumber: "",
          courtCaseId: SET_BY_PROCESSOR,
          courtCaseReference: "21/2732/000015Y",
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
              offenceId: "413560c9-91cf-4ee8-ae0a-14af4c082c7e",
              adjudications: [
                {
                  appearanceNumber: 1,
                  adjudicationId: "eeacd1fb-4432-4b27-a810-f91979dca65a",
                  disposalDate: "2011-10-01",
                  adjudication: "Guilty"
                }
              ],
              disposalResults: [
                {
                  disposalId: "6117694c-760b-48ed-aa50-a713787c90b5",
                  disposalCode: 4004,
                  disposalEffectiveDate: "2012-01-01",
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
      pncCheckName: "ADDEDOFFENCE",
      croNumber: "",
      arrestSummonsNumber: "11/01ZD/01/445117G",
      crimeOffenceReferenceNo: "",
      remandLocationFfss: "",
      ownerCode: "01YZ",
      longPersonUrn: "2021/21R",
      remandDate: "2012-01-01",
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
  })
]
