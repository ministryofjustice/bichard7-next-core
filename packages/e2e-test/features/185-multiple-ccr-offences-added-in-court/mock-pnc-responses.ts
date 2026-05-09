import extractAsnFromInputXml from "../../utils/extractAsnFromInputXml"
import type Bichard from "../../utils/world"

export default (_: string, { policeApi }: Bichard) => [
  policeApi.mockAsnQuery({
    matchRegex: "CXE01",
    response: {
      pncCheckName: "HARMON",
      croNumber: "",
      gmh: "073ENQR000140RENQASIPNCA05A73000017300000120210831093073000001                                             050001967",
      gmt: "000011073ENQR000140R",
      personId: "09816f2f-91e0-4a84-94ad-2e8312ece701",
      personUrn: "12/24H",
      reportId: "bdd59acf-5f54-4809-9d13-a791d8989c50",
      asn: "1200000000000000016D",
      ownerCode: "01ZD",
      disposals: [
        {
          crimeOffenceReferenceNumber: "",
          courtCaseId: "4d8c13ee-732e-46ad-ba88-e243054710e4",
          courtCaseReference: "12/2732/000041V",
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
              offenceStartDate: "2009-06-01",
              offenceId: "2c4836a0-9b90-4d93-9dbb-4c035cd8fcf5",
              disposalResults: []
            },
            {
              acpoOffenceCode: "1:9:7:1",
              courtOffenceSequenceNumber: 2,
              cjsOffenceCode: "OF61016",
              roleQualifiers: [],
              legislationQualifiers: [],
              offenceTic: 0,
              offenceStartDate: "2009-06-01",
              offenceId: "3c92d789-de8d-4dd2-ac57-aa1d3fc47bee",
              disposalResults: []
            }
          ]
        },
        {
          crimeOffenceReferenceNumber: "",
          courtCaseId: "4d8c13ee-732e-46ad-ba88-e243054710e4",
          courtCaseReference: "12/2732/000042W",
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
              offenceId: "ae433620-162f-4485-b318-2882580706b0",
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
      pncCheckName: "HARMON",
      croNumber: "",
      crimeOffenceReferenceNumber: "",
      ownerCode: "01YZ",
      personUrn: "12/24H",
      courtCaseReference: "12/2732/000041V",
      court: {
        courtIdentityType: "code",
        courtCode: "2576"
      },
      dateOfConviction: "2009-10-09",
      defendant: {
        defendantType: "individual",
        defendantFirstNames: ["MARTIN"],
        defendantLastName: "HARMON"
      },
      offences: [
        {
          courtOffenceSequenceNumber: 1,
          cjsOffenceCode: "RR84042",
          plea: "Not Guilty",
          adjudication: "Not Guilty",
          dateOfSentence: "2009-10-09",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 2004
            }
          ],
          offenceId: "586e2082-8e80-4076-b703-4e3882cf83ab"
        },
        {
          courtOffenceSequenceNumber: 2,
          cjsOffenceCode: "OF61016",
          plea: "Not Guilty",
          adjudication: "Not Guilty",
          dateOfSentence: "2009-10-09",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 2004
            }
          ],
          offenceId: "2fa52a99-549b-4a42-be8e-c78e452f7713"
        }
      ]
    },
    count: 1
  }),
  policeApi.mockUpdate("CXU01", {
    expectedRequest: {
      pncCheckName: "HARMON",
      croNumber: "",
      arrestSummonsNumber: "12/0000/00/16D",
      crimeOffenceReferenceNo: "",
      remandLocationFfss: "",
      ownerCode: "01YZ",
      personUrn: "12/24H",
      remandDate: "2009-10-09",
      appearanceResult: "remanded-on-bail",
      bailConditions: [],
      currentAppearance: {
        court: {
          courtIdentityType: "code",
          courtCode: "2576"
        }
      },
      nextAppearance: {
        date: "2009-10-19",
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
      pncCheckName: "HARMON",
      croNumber: "",
      gmh: "073ENQR000141RENQASIPNCA05A73000017300000120210831093073000001                                             050001970",
      gmt: "000015073ENQR000141R",
      personId: "6a36d2fc-a42a-46be-ae34-8bb04d1be894",
      personUrn: "12/24H",
      reportId: "99f8db5b-26a1-4c95-9745-318d2ed18ec6",
      asn: "1200000000000000016D",
      ownerCode: "01ZD",
      disposals: [
        {
          crimeOffenceReferenceNumber: "",
          courtCaseId: "871b408f-87f9-43dd-a999-fd15b00704ee",
          courtCaseReference: "12/2732/000041V",
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
              offenceStartDate: "2009-06-01",
              offenceId: "fbfded19-54a5-491e-ab47-3a048de76f99",
              adjudications: [
                {
                  appearanceNumber: 1,
                  adjudicationId: "1b5bb539-eb75-4f81-b556-cdf8b0811584",
                  disposalDate: "2009-10-09",
                  adjudication: "Not Guilty"
                }
              ],
              disposalResults: [
                {
                  disposalId: "13538845-b1ee-4bac-8310-e85208dd3ffb",
                  disposalCode: 2004,
                  disposalText: ""
                }
              ]
            },
            {
              acpoOffenceCode: "1:9:7:1",
              courtOffenceSequenceNumber: 2,
              cjsOffenceCode: "OF61016",
              roleQualifiers: [],
              legislationQualifiers: [],
              plea: "Not Guilty",
              offenceTic: 0,
              offenceStartDate: "2009-06-01",
              offenceId: "fa899843-b99e-4e15-876a-279cf9f1f553",
              adjudications: [
                {
                  appearanceNumber: 1,
                  adjudicationId: "2987648f-7496-45c6-848b-5811b149b9fe",
                  disposalDate: "2009-10-09",
                  adjudication: "Not Guilty"
                }
              ],
              disposalResults: [
                {
                  disposalId: "b6a07146-98e3-4eea-9cd4-d58b163e4cbf",
                  disposalCode: 2004,
                  disposalText: ""
                }
              ]
            }
          ]
        },
        {
          crimeOffenceReferenceNumber: "",
          courtCaseId: "871b408f-87f9-43dd-a999-fd15b00704ee",
          courtCaseReference: "12/2732/000042W",
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
              offenceId: "95e1a99c-459b-4564-83e1-3c014588635f",
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
      pncCheckName: "HARMON",
      croNumber: "",
      crimeOffenceReferenceNumber: "",
      ownerCode: "01YZ",
      personUrn: "12/24H",
      courtCaseReference: "12/2732/000042W",
      court: {
        courtIdentityType: "code",
        courtCode: "2576"
      },
      dateOfConviction: "2009-10-19",
      defendant: {
        defendantType: "individual",
        defendantFirstNames: ["MARTIN"],
        defendantLastName: "HARMON"
      },
      offences: [
        {
          courtOffenceSequenceNumber: 1,
          cjsOffenceCode: "TH68001",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2009-10-19",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 4004,
              disposalEffectiveDate: "2009-10-21"
            }
          ],
          offenceId: "f427b4ca-4c81-4255-b61f-7822928ac125"
        }
      ],
      additionalArrestOffences: [
        {
          asn: "12/0000/00/16D",
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
              dateOfSentence: "2009-10-19",
              offenceTic: 0,
              offenceStartDate: "2006-11-02",
              disposalResults: [
                {
                  disposalCode: 1002,
                  disposalDuration: {
                    units: "months",
                    count: 14
                  }
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
      pncCheckName: "HARMON",
      croNumber: "",
      arrestSummonsNumber: "12/0000/00/16D",
      crimeOffenceReferenceNo: "",
      remandLocationFfss: "",
      ownerCode: "01YZ",
      personUrn: "12/24H",
      remandDate: "2009-10-19",
      appearanceResult: "remanded-on-bail",
      bailConditions: [],
      currentAppearance: {
        court: {
          courtIdentityType: "code",
          courtCode: "2576"
        }
      },
      nextAppearance: {
        date: "2009-10-21",
        court: {
          courtIdentityType: "code",
          courtCode: "2576"
        }
      }
    },
    count: 1
  })
]
