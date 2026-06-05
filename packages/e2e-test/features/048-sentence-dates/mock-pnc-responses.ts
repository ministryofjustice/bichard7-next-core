import { SET_BY_PROCESSOR } from "../../utils/constants"
import extractAsnFromInputXml from "../../utils/extractAsnFromInputXml"
import type Bichard from "../../utils/world"

export default (_: string, { policeApi }: Bichard) => [
  policeApi.mockAsnQuery({
    matchRegex: "CXE01",
    response: {
      pncCheckName: "TENENBAUM",
      croNumber: "",
      gmh: "073ENQR000689RENQASIPNCA05A73000017300000120210903101373000001                                             050002864",
      gmt: "000008073ENQR000689R",
      personId: SET_BY_PROCESSOR,
      longPersonUrn: "2021/2W",
      reportId: SET_BY_PROCESSOR,
      asn: "1101ZD0100000410799E",
      ownerCode: "01ZD",
      disposals: [
        {
          crimeOffenceReferenceNumber: "",
          courtCaseId: SET_BY_PROCESSOR,
          courtCaseReference: "21/2732/000002J",
          caseStatusMarker: "impending-prosecution-detail",
          court: {
            courtIdentityType: "code",
            courtCode: "0000"
          },
          offences: [
            {
              acpoOffenceCode: "1:9:7:2",
              courtOffenceSequenceNumber: 1,
              cjsOffenceCode: "OF61018",
              roleQualifiers: [],
              legislationQualifiers: [],
              offenceTic: 0,
              offenceStartDate: "2010-11-28",
              offenceId: "1514eed0-3831-427f-98d3-6c4b6da4828c",
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
      pncCheckName: "TENENBAUM",
      croNumber: "",
      crimeOffenceReferenceNumber: "",
      ownerCode: "01YZ",
      longPersonUrn: "2021/2W",
      courtCaseReference: "21/2732/000002J",
      court: {
        courtIdentityType: "code",
        courtCode: "2576"
      },
      dateOfConviction: "2011-09-26",
      defendant: {
        defendantType: "individual",
        defendantFirstNames: ["CHAS"],
        defendantLastName: "TENENBAUM"
      },
      offences: [
        {
          courtOffenceSequenceNumber: 1,
          cjsOffenceCode: "OF61018",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-09-26",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 4027,
              disposalEffectiveDate: "2011-10-01"
            }
          ],
          offenceId: "067f5f42-0cb5-48f2-88d7-44b44b49f6d8"
        }
      ]
    },
    count: 1
  }),
  policeApi.mockUpdate("CXU01", {
    expectedRequest: {
      pncCheckName: "TENENBAUM",
      croNumber: "",
      arrestSummonsNumber: "11/01ZD/01/410799E",
      crimeOffenceReferenceNo: "",
      remandLocationFfss: "",
      ownerCode: "01YZ",
      longPersonUrn: "2021/2W",
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
        date: "2011-10-01",
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
      pncCheckName: "TENENBAUM",
      croNumber: "",
      gmh: "073ENQR000690RENQASIPNCA05A73000017300000120210903101373000001                                             050002867",
      gmt: "000010073ENQR000690R",
      personId: SET_BY_PROCESSOR,
      longPersonUrn: "2021/2W",
      reportId: SET_BY_PROCESSOR,
      asn: "1101ZD0100000410799E",
      ownerCode: "01ZD",
      disposals: [
        {
          crimeOffenceReferenceNumber: "",
          courtCaseId: SET_BY_PROCESSOR,
          courtCaseReference: "21/2732/000002J",
          caseStatusMarker: "impending-prosecution-detail",
          court: {
            courtIdentityType: "code",
            courtCode: "0000"
          },
          offences: [
            {
              acpoOffenceCode: "1:9:7:2",
              courtOffenceSequenceNumber: 1,
              cjsOffenceCode: "OF61018",
              roleQualifiers: [],
              legislationQualifiers: [],
              plea: "Not Guilty",
              offenceTic: 0,
              offenceStartDate: "2010-11-28",
              offenceId: "10a445a9-4ae4-48e2-8029-9628ba06d135",
              adjudications: [
                {
                  appearanceNumber: 1,
                  adjudicationId: "f1de608a-9825-4588-8943-eba654e78981",
                  disposalDate: "2011-09-26",
                  adjudication: "Guilty"
                }
              ],
              disposalResults: [
                {
                  disposalId: "b60b121f-a6c6-4c20-8139-2eb44f9d456f",
                  disposalCode: 4027,
                  disposalEffectiveDate: "2011-10-01",
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
      pncCheckName: "TENENBAUM",
      croNumber: "",
      arrestSummonsNumber: "11/01ZD/01/410799E",
      crimeOffenceReferenceNo: "",
      remandLocationFfss: "",
      ownerCode: "01YZ",
      longPersonUrn: "2021/2W",
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
      pncCheckName: "TENENBAUM",
      croNumber: "",
      gmh: "073ENQR000691RENQASIPNCA05A73000017300000120210903101373000001                                             050002869",
      gmt: "000010073ENQR000691R",
      personId: SET_BY_PROCESSOR,
      longPersonUrn: "2021/2W",
      reportId: SET_BY_PROCESSOR,
      asn: "1101ZD0100000410799E",
      ownerCode: "01ZD",
      disposals: [
        {
          crimeOffenceReferenceNumber: "",
          courtCaseId: SET_BY_PROCESSOR,
          courtCaseReference: "21/2732/000002J",
          caseStatusMarker: "impending-prosecution-detail",
          court: {
            courtIdentityType: "code",
            courtCode: "0000"
          },
          offences: [
            {
              acpoOffenceCode: "1:9:7:2",
              courtOffenceSequenceNumber: 1,
              cjsOffenceCode: "OF61018",
              roleQualifiers: [],
              legislationQualifiers: [],
              plea: "Not Guilty",
              offenceTic: 0,
              offenceStartDate: "2010-11-28",
              offenceId: "db300a3a-60ba-4564-af63-dc104708f9bc",
              adjudications: [
                {
                  appearanceNumber: 1,
                  adjudicationId: "1e0f6223-1bdc-43c1-8793-91749ea3efa9",
                  disposalDate: "2011-09-26",
                  adjudication: "Guilty"
                }
              ],
              disposalResults: [
                {
                  disposalId: "9fa8b49d-c6cb-421a-b621-4178b87fc4e0",
                  disposalCode: 4027,
                  disposalEffectiveDate: "2011-10-01",
                  disposalText: ""
                }
              ]
            }
          ]
        }
      ]
    },
    asn: extractAsnFromInputXml(`${__dirname}/input-message-3.xml`),
    expectedRequest: "",
    count: 1
  }),
  policeApi.mockUpdate("CXU04", {
    expectedRequest: {
      pncCheckName: "TENENBAUM",
      croNumber: "",
      crimeOffenceReferenceNumber: "",
      ownerCode: "01YZ",
      longPersonUrn: "2021/2W",
      courtCaseReference: "21/2732/000002J",
      court: {
        courtIdentityType: "code",
        courtCode: "2576"
      },
      appearanceDate: "2011-10-08",
      reasonForAppearance: "Sentence Deferred",
      offences: [
        {
          courtOffenceSequenceNumber: 1,
          cjsOffenceCode: "OF61018",
          disposalResults: [
            {
              disposalCode: 1002,
              disposalDuration: {
                units: "months",
                count: 3
              }
            }
          ],
          offenceId: "a7168b59-0693-40c8-ae88-ea54255f6198"
        }
      ]
    },
    count: 1
  })
]
