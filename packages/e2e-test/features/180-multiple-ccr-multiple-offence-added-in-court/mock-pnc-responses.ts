import { SET_BY_PROCESSOR } from "../../utils/constants"
import extractAsnFromInputXml from "../../utils/extractAsnFromInputXml"
import type Bichard from "../../utils/world"

export default (_: string, { policeApi }: Bichard) => [
  policeApi.mockAsnQuery({
    matchRegex: "CXE01",
    response: {
      pncCheckName: "CANBERRA",
      croNumber: "",
      gmh: "073ENQR000049RENQASIPNCA05A73000017300000120210827105973000001                                             050001807",
      gmt: "000011073ENQR000049R",
      personId: SET_BY_PROCESSOR,
      longPersonUrn: "2012/17A",
      reportId: SET_BY_PROCESSOR,
      asn: "1200000000000000009W",
      ownerCode: "01ZD",
      disposals: [
        {
          crimeOffenceReferenceNumber: "",
          courtCaseId: SET_BY_PROCESSOR,
          courtCaseReference: "12/2732/000024B",
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
              offenceId: "cf5c1655-0f71-4feb-b6b0-cf8a3a821e7b",
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
              offenceId: "7fcaad89-e082-487e-b885-237ea35c662d",
              disposalResults: []
            }
          ]
        },
        {
          crimeOffenceReferenceNumber: "",
          courtCaseId: SET_BY_PROCESSOR,
          courtCaseReference: "12/2732/000025C",
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
              offenceId: "73db3b71-3dde-4a6a-a9e2-73cbfe2629bf",
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
      pncCheckName: "CANBERRA",
      croNumber: "",
      crimeOffenceReferenceNumber: "",
      ownerCode: "01YZ",
      longPersonUrn: "2012/17A",
      courtCaseReference: "12/2732/000024B",
      court: {
        courtIdentityType: "code",
        courtCode: "2576"
      },
      dateOfConviction: "2009-10-10",
      defendant: {
        defendantType: "individual",
        defendantFirstNames: ["MARTIN"],
        defendantLastName: "CANBERRA"
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
          offenceId: "64c811af-ab94-4bb5-ac25-32b9149c0a59"
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
          offenceId: "3b7b564e-4cfc-47f7-8e2b-f01bdb20f5db"
        }
      ]
    },
    count: 1
  }),
  policeApi.mockAsnQuery({
    matchRegex: "CXE01",
    response: {
      pncCheckName: "CANBERRA",
      croNumber: "",
      gmh: "073ENQR000050RENQASIPNCA05A73000017300000120210827105973000001                                             050001808",
      gmt: "000015073ENQR000050R",
      personId: SET_BY_PROCESSOR,
      longPersonUrn: "2012/17A",
      reportId: SET_BY_PROCESSOR,
      asn: "1200000000000000009W",
      ownerCode: "01ZD",
      disposals: [
        {
          crimeOffenceReferenceNumber: "",
          courtCaseId: SET_BY_PROCESSOR,
          courtCaseReference: "12/2732/000024B",
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
              offenceId: "6ce0b2cd-8c0a-4067-9d47-b07b74227acf",
              adjudications: [
                {
                  appearanceNumber: 1,
                  adjudicationId: "b33fb856-e0ed-432c-915b-4694b614333d",
                  disposalDate: "2009-10-10",
                  adjudication: "Guilty"
                }
              ],
              disposalResults: [
                {
                  disposalId: "91fac979-4ea0-4f7d-be40-2500db1328c1",
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
              offenceId: "302173be-d3e7-4cd8-a418-3fd447317943",
              adjudications: [
                {
                  appearanceNumber: 1,
                  adjudicationId: "cb7e921b-6792-4a79-881e-75bdb685f5d1",
                  disposalDate: "2009-10-10",
                  adjudication: "Guilty"
                }
              ],
              disposalResults: [
                {
                  disposalId: "6dc40c35-38e1-4433-aa20-45bb3c20b22c",
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
          courtCaseReference: "12/2732/000025C",
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
              offenceId: "a3578d8a-a82e-492c-9e5c-001b0cbf878f",
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
  policeApi.mockUpdate("CXU02", {
    expectedRequest: {
      pncCheckName: "CANBERRA",
      croNumber: "",
      crimeOffenceReferenceNumber: "",
      ownerCode: "01YZ",
      longPersonUrn: "2012/17A",
      courtCaseReference: "12/2732/000025C",
      court: {
        courtIdentityType: "code",
        courtCode: "2576"
      },
      dateOfConviction: "2009-10-20",
      defendant: {
        defendantType: "individual",
        defendantFirstNames: ["MARTIN"],
        defendantLastName: "CANBERRA"
      },
      offences: [
        {
          courtOffenceSequenceNumber: 1,
          cjsOffenceCode: "TH68001",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2009-10-20",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 4004,
              disposalEffectiveDate: "2009-11-08"
            }
          ],
          offenceId: "67da269d-836d-47a8-b93c-e1ff31fb5f59"
        }
      ],
      additionalArrestOffences: [
        {
          asn: "12/0000/00/9W",
          additionalOffences: [
            {
              courtOffenceSequenceNumber: 0,
              offenceCode: {
                offenceCodeType: "cjs",
                cjsOffenceCode: "TH68151"
              },
              committedOnBail: false,
              plea: "Not Guilty",
              adjudication: "Guilty",
              dateOfSentence: "2009-10-20",
              offenceTic: 0,
              offenceStartDate: "2006-11-02",
              disposalResults: [
                {
                  disposalCode: 4004,
                  disposalEffectiveDate: "2009-11-08"
                }
              ],
              locationFsCode: "01ZD",
              locationText: {
                locationText: "KINGSTON HIGH STREET"
              }
            },
            {
              courtOffenceSequenceNumber: 0,
              offenceCode: {
                offenceCodeType: "cjs",
                cjsOffenceCode: "TH68145"
              },
              committedOnBail: false,
              plea: "Not Guilty",
              adjudication: "Guilty",
              dateOfSentence: "2009-10-20",
              offenceTic: 0,
              offenceStartDate: "2006-11-02",
              disposalResults: [
                {
                  disposalCode: 4004,
                  disposalEffectiveDate: "2009-11-08"
                }
              ],
              locationFsCode: "01ZD",
              locationText: {
                locationText: "KINGSTON HIGH STREET"
              }
            }
          ]
        }
      ]
    },
    count: 1
  }),
  policeApi.mockUpdate("CXU01", {
    expectedRequest: {
      pncCheckName: "CANBERRA",
      croNumber: "",
      arrestSummonsNumber: "12/0000/00/9W",
      crimeOffenceReferenceNo: "",
      remandLocationFfss: "",
      ownerCode: "01YZ",
      longPersonUrn: "2012/17A",
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
