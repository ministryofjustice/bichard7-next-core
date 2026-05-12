import { SET_BY_PROCESSOR } from "../../utils/constants"
import extractAsnFromInputXml from "../../utils/extractAsnFromInputXml"
import type Bichard from "../../utils/world"

export default (_: string, { policeApi }: Bichard) => [
  policeApi.mockAsnQuery({
    matchRegex: "CXE01",
    response: {
      pncCheckName: "OFFENCES",
      croNumber: "",
      gmh: "073ENQR000694RENQASIPNCA05A73000017300000120210903101573000001                                             050002875",
      gmt: "000011073ENQR000694R",
      personId: SET_BY_PROCESSOR,
      personUrn: "2021/9D",
      reportId: SET_BY_PROCESSOR,
      asn: "1101VK0100000376263Q",
      ownerCode: "01VK",
      disposals: [
        {
          crimeOffenceReferenceNumber: "",
          courtCaseId: SET_BY_PROCESSOR,
          courtCaseReference: "21/2812/000003G",
          caseStatusMarker: "impending-prosecution-detail",
          court: {
            courtIdentityType: "code",
            courtCode: "0000"
          },
          offences: [
            {
              acpoOffenceCode: "5:5:5:1",
              courtOffenceSequenceNumber: 1,
              cjsOffenceCode: "TH68006",
              roleQualifiers: [],
              legislationQualifiers: [],
              offenceTic: 0,
              offenceStartDate: "2006-11-28",
              offenceId: "de516778-981c-4470-aab1-598df1dd2fd5",
              disposalResults: []
            },
            {
              acpoOffenceCode: "5:7:11:10",
              courtOffenceSequenceNumber: 2,
              cjsOffenceCode: "TH68151",
              roleQualifiers: [],
              legislationQualifiers: [],
              offenceTic: 0,
              offenceStartDate: "2006-11-28",
              offenceId: "9ae215d6-6d26-4fad-9239-4f26c4705147",
              disposalResults: []
            },
            {
              acpoOffenceCode: "5:5:2:1",
              courtOffenceSequenceNumber: 3,
              cjsOffenceCode: "TH68001",
              roleQualifiers: [],
              legislationQualifiers: [],
              offenceTic: 0,
              offenceStartDate: "2006-11-28",
              offenceId: "cb4bb8df-af88-454b-abe6-56eea6b5a2f8",
              disposalResults: []
            },
            {
              acpoOffenceCode: "5:5:6:1",
              courtOffenceSequenceNumber: 4,
              cjsOffenceCode: "TH68007",
              roleQualifiers: [],
              legislationQualifiers: [],
              offenceTic: 0,
              offenceStartDate: "2006-11-28",
              offenceId: "b4270f73-c807-42c5-8e20-9b718a3e9d24",
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
      pncCheckName: "OFFENCES",
      croNumber: "",
      crimeOffenceReferenceNumber: "",
      ownerCode: "01YZ",
      personUrn: "2021/9D",
      courtCaseReference: "21/2812/000003G",
      court: {
        courtIdentityType: "code",
        courtCode: "2576"
      },
      dateOfConviction: "2009-05-08",
      defendant: {
        defendantType: "individual",
        defendantFirstNames: ["DISMISSED"],
        defendantLastName: "OFFENCES"
      },
      carryForward: {
        appearanceDate: "2009-11-01",
        court: {
          courtIdentityType: "code",
          courtCode: "2576"
        }
      },
      offences: [
        {
          courtOffenceSequenceNumber: 1,
          cjsOffenceCode: "TH68006",
          plea: "Not Guilty",
          adjudication: "Not Guilty",
          dateOfSentence: "2009-05-08",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 2006
            }
          ],
          offenceId: "0505f827-2669-4a2d-8826-7a472eeafcc0"
        },
        {
          courtOffenceSequenceNumber: 2,
          cjsOffenceCode: "TH68151",
          plea: "Not Guilty",
          adjudication: "Not Guilty",
          dateOfSentence: "2009-05-08",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 2006
            }
          ],
          offenceId: "1fe82c7d-6814-4aba-a24a-60c6472fd30b"
        },
        {
          courtOffenceSequenceNumber: 3,
          cjsOffenceCode: "TH68001",
          plea: "Not Guilty",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 2059
            }
          ],
          offenceId: "77313579-537e-48bb-a61c-856dcb5d53f8"
        },
        {
          courtOffenceSequenceNumber: 4,
          cjsOffenceCode: "TH68007",
          plea: "Not Guilty",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 2059
            }
          ],
          offenceId: "b844876a-ba17-422c-9e8b-e172de414ba1"
        }
      ]
    },
    count: 1
  }),
  policeApi.mockUpdate("CXU01", {
    expectedRequest: {
      pncCheckName: "OFFENCES",
      croNumber: "",
      arrestSummonsNumber: "11/01VK/01/376263Q",
      crimeOffenceReferenceNo: "",
      remandLocationFfss: "",
      ownerCode: "01YZ",
      personUrn: "2021/9D",
      remandDate: "2009-05-08",
      appearanceResult: "remanded-on-bail",
      bailConditions: [],
      currentAppearance: {
        court: {
          courtIdentityType: "code",
          courtCode: "2576"
        }
      },
      nextAppearance: {
        date: "2009-11-01",
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
      pncCheckName: "OFFENCES",
      croNumber: "",
      gmh: "073ENQR000695RENQASIPNCA05A73000017300000120210903102073000001                                             050002878",
      gmt: "000016073ENQR000695R",
      personId: SET_BY_PROCESSOR,
      personUrn: "2021/9D",
      reportId: SET_BY_PROCESSOR,
      asn: "1101VK0100000376263Q",
      ownerCode: "01VK",
      disposals: [
        {
          crimeOffenceReferenceNumber: "",
          courtCaseId: SET_BY_PROCESSOR,
          courtCaseReference: "21/2812/000003G",
          caseStatusMarker: "impending-prosecution-detail",
          court: {
            courtIdentityType: "code",
            courtCode: "0000"
          },
          offences: [
            {
              acpoOffenceCode: "5:5:5:1",
              courtOffenceSequenceNumber: 1,
              cjsOffenceCode: "TH68006",
              roleQualifiers: [],
              legislationQualifiers: [],
              plea: "Not Guilty",
              offenceTic: 0,
              offenceStartDate: "2006-11-28",
              offenceId: "b156287e-aa3c-4318-804f-98c2401d52d3",
              adjudications: [
                {
                  appearanceNumber: 1,
                  adjudicationId: "2c631f3b-3179-4777-9678-2ae25b94b8d9",
                  disposalDate: "2009-05-08",
                  adjudication: "Not Guilty"
                }
              ],
              disposalResults: [
                {
                  disposalId: "4fa5db2f-3334-4313-8073-2acb23649559",
                  disposalCode: 2006,
                  disposalText: ""
                }
              ]
            },
            {
              acpoOffenceCode: "5:7:11:10",
              courtOffenceSequenceNumber: 2,
              cjsOffenceCode: "TH68151",
              roleQualifiers: [],
              legislationQualifiers: [],
              plea: "Not Guilty",
              offenceTic: 0,
              offenceStartDate: "2006-11-28",
              offenceId: "d5b8b6f3-26ad-4e74-89fd-1cb65cc08f23",
              adjudications: [
                {
                  appearanceNumber: 1,
                  adjudicationId: "17f9acee-0ca2-4334-9178-cc16a846ff84",
                  disposalDate: "2009-05-08",
                  adjudication: "Not Guilty"
                }
              ],
              disposalResults: [
                {
                  disposalId: "dc6d2fdd-fb0f-489c-b468-113c3159ccb4",
                  disposalCode: 2006,
                  disposalText: ""
                }
              ]
            }
          ]
        },
        {
          crimeOffenceReferenceNumber: "",
          courtCaseId: SET_BY_PROCESSOR,
          courtCaseReference: "21/2732/000024H",
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
              offenceStartDate: "2006-11-28",
              offenceId: "d44ec006-8c8e-4d68-81d0-42d91eab38c9",
              disposalResults: []
            },
            {
              acpoOffenceCode: "5:5:6:1",
              courtOffenceSequenceNumber: 2,
              cjsOffenceCode: "TH68007",
              roleQualifiers: [],
              legislationQualifiers: [],
              offenceTic: 0,
              offenceStartDate: "2006-11-28",
              offenceId: "62af1d40-d507-4117-abe7-232669ec49e7",
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
      pncCheckName: "OFFENCES",
      croNumber: "",
      crimeOffenceReferenceNumber: "",
      ownerCode: "01YZ",
      personUrn: "2021/9D",
      courtCaseReference: "21/2732/000024H",
      court: {
        courtIdentityType: "code",
        courtCode: "2576"
      },
      dateOfConviction: "2008-11-01",
      defendant: {
        defendantType: "individual",
        defendantFirstNames: ["DISMISSED"],
        defendantLastName: "OFFENCES"
      },
      offences: [
        {
          courtOffenceSequenceNumber: 1,
          cjsOffenceCode: "TH68001",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2008-11-01",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 4011,
              disposalEffectiveDate: "2008-12-02"
            }
          ],
          offenceId: "25f5f69c-013f-4838-a394-7a1e46e8be9c"
        },
        {
          courtOffenceSequenceNumber: 2,
          cjsOffenceCode: "TH68007",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2008-11-01",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 4011,
              disposalEffectiveDate: "2008-12-02"
            }
          ],
          offenceId: "0e42cbca-00a1-444c-a38c-b3352050c034"
        }
      ]
    },
    count: 1
  }),
  policeApi.mockUpdate("CXU01", {
    expectedRequest: {
      pncCheckName: "OFFENCES",
      croNumber: "",
      arrestSummonsNumber: "11/01VK/01/376263Q",
      crimeOffenceReferenceNo: "",
      remandLocationFfss: "",
      ownerCode: "01YZ",
      personUrn: "2021/9D",
      remandDate: "2008-11-01",
      appearanceResult: "remanded-on-bail",
      bailConditions: ["GIVE TO THE COURT ANY PASSPORT HELD               "],
      currentAppearance: {
        court: {
          courtIdentityType: "code",
          courtCode: "2576"
        }
      },
      nextAppearance: {
        date: "2008-12-02",
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
      pncCheckName: "OFFENCES",
      croNumber: "",
      gmh: "073ENQR000696RENQASIPNCA05A73000017300000120210903102073000001                                             050002881",
      gmt: "000020073ENQR000696R",
      personId: SET_BY_PROCESSOR,
      personUrn: "2021/9D",
      reportId: SET_BY_PROCESSOR,
      asn: "1101VK0100000376263Q",
      ownerCode: "01VK",
      disposals: [
        {
          crimeOffenceReferenceNumber: "",
          courtCaseId: SET_BY_PROCESSOR,
          courtCaseReference: "21/2812/000003G",
          caseStatusMarker: "impending-prosecution-detail",
          court: {
            courtIdentityType: "code",
            courtCode: "0000"
          },
          offences: [
            {
              acpoOffenceCode: "5:5:5:1",
              courtOffenceSequenceNumber: 1,
              cjsOffenceCode: "TH68006",
              roleQualifiers: [],
              legislationQualifiers: [],
              plea: "Not Guilty",
              offenceTic: 0,
              offenceStartDate: "2006-11-28",
              offenceId: "3e451364-c0bc-4ba0-a87a-24006ea82b47",
              adjudications: [
                {
                  appearanceNumber: 1,
                  adjudicationId: "5328324b-951f-4e64-867a-89bbcfd3340b",
                  disposalDate: "2009-05-08",
                  adjudication: "Not Guilty"
                }
              ],
              disposalResults: [
                {
                  disposalId: "85ec85d6-575a-4a73-8e41-b2b342d8b34f",
                  disposalCode: 2006,
                  disposalText: ""
                }
              ]
            },
            {
              acpoOffenceCode: "5:7:11:10",
              courtOffenceSequenceNumber: 2,
              cjsOffenceCode: "TH68151",
              roleQualifiers: [],
              legislationQualifiers: [],
              plea: "Not Guilty",
              offenceTic: 0,
              offenceStartDate: "2006-11-28",
              offenceId: "36b1c3d5-446a-407e-80d7-937c80026ebe",
              adjudications: [
                {
                  appearanceNumber: 1,
                  adjudicationId: "fd17e79d-fbb2-4d2f-8adb-21f5eea27bfb",
                  disposalDate: "2009-05-08",
                  adjudication: "Not Guilty"
                }
              ],
              disposalResults: [
                {
                  disposalId: "567a78e4-c76b-4d19-b52b-7ade59c8c822",
                  disposalCode: 2006,
                  disposalText: ""
                }
              ]
            }
          ]
        },
        {
          crimeOffenceReferenceNumber: "",
          courtCaseId: SET_BY_PROCESSOR,
          courtCaseReference: "21/2732/000024H",
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
              plea: "Not Guilty",
              offenceTic: 0,
              offenceStartDate: "2006-11-28",
              offenceId: "16038d41-23e9-4e93-8ce1-34b1c0691dc5",
              adjudications: [
                {
                  appearanceNumber: 1,
                  adjudicationId: "22428323-5ba3-49e5-bbe7-3bbf650cac50",
                  disposalDate: "2008-11-01",
                  adjudication: "Guilty"
                }
              ],
              disposalResults: [
                {
                  disposalId: "72108825-16c4-4370-9a9a-905c2b5297fe",
                  disposalCode: 4011,
                  disposalEffectiveDate: "2008-12-02",
                  disposalText: ""
                }
              ]
            },
            {
              acpoOffenceCode: "5:5:6:1",
              courtOffenceSequenceNumber: 2,
              cjsOffenceCode: "TH68007",
              roleQualifiers: [],
              legislationQualifiers: [],
              plea: "Not Guilty",
              offenceTic: 0,
              offenceStartDate: "2006-11-28",
              offenceId: "fe423b24-02b7-4571-9f03-7f2153fc9e2f",
              adjudications: [
                {
                  appearanceNumber: 1,
                  adjudicationId: "5b3f0c58-2d00-43d6-a9e1-59a9ed86da2a",
                  disposalDate: "2008-11-01",
                  adjudication: "Guilty"
                }
              ],
              disposalResults: [
                {
                  disposalId: "98dc1d62-8019-430c-88e1-bc56d4d3d5d8",
                  disposalCode: 4011,
                  disposalEffectiveDate: "2008-12-02",
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
      pncCheckName: "OFFENCES",
      croNumber: "",
      crimeOffenceReferenceNumber: "",
      ownerCode: "01YZ",
      personUrn: "2021/9D",
      courtCaseReference: "21/2732/000024H",
      court: {
        courtIdentityType: "code",
        courtCode: "2576"
      },
      appearanceDate: "2008-12-02",
      reasonForAppearance: "Sentence Deferred",
      offences: [
        {
          courtOffenceSequenceNumber: 1,
          cjsOffenceCode: "TH68001",
          disposalResults: [
            {
              disposalCode: 1116,
              disposalEffectiveDate: "2009-05-29"
            },
            {
              disposalCode: 3101,
              disposalDuration: {
                units: "hours",
                count: 100
              }
            }
          ],
          offenceId: "d67234b7-4baa-4693-941d-58dc1920a180"
        },
        {
          courtOffenceSequenceNumber: 2,
          cjsOffenceCode: "TH68007",
          disposalResults: [
            {
              disposalCode: 1116,
              disposalEffectiveDate: "2009-05-29"
            },
            {
              disposalCode: 3101,
              disposalDuration: {
                units: "hours",
                count: 19
              }
            }
          ],
          offenceId: "f13377b4-f6d7-41c1-8e66-50135c92b8b5"
        }
      ]
    },
    count: 1
  })
]
