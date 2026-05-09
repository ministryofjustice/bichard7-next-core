import extractAsnFromInputXml from "../../utils/extractAsnFromInputXml"
import type Bichard from "../../utils/world"

export default (_: string, { policeApi }: Bichard) => [
  policeApi.mockAsnQuery({
    matchRegex: "CXE01",
    response: {
      pncCheckName: "NOLAN",
      croNumber: "",
      gmh: "073ENQR000074RENQASIPNCA05A73000017300000120210827074173000001                                             050001861",
      gmt: "000011073ENQR000074R",
      personId: "511e1f3a-4d65-40b4-bf87-95f6fc0ebf2b",
      personUrn: "09/478F",
      reportId: "34703f43-6ef4-4adb-82a6-59e38fc57385",
      asn: "0900000000000020002F",
      ownerCode: "01VK",
      disposals: [
        {
          crimeOffenceReferenceNumber: "",
          courtCaseId: "5de3be8f-4ce0-4b7c-b0bd-404b1fa6ea2c",
          courtCaseReference: "09/0428/000444E",
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
              offenceId: "0ee7217c-273f-448c-8892-c0a03be8fa83",
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
              offenceId: "d71c6ab9-796d-4134-9653-1923d45766ba",
              disposalResults: []
            }
          ]
        },
        {
          crimeOffenceReferenceNumber: "",
          courtCaseId: "5de3be8f-4ce0-4b7c-b0bd-404b1fa6ea2c",
          courtCaseReference: "09/0413/000445H",
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
              offenceId: "d3aeab30-18df-415c-b00e-658f18035add",
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
      pncCheckName: "NOLAN",
      croNumber: "",
      crimeOffenceReferenceNumber: "",
      ownerCode: "01YZ",
      personUrn: "09/478F",
      courtCaseReference: "09/0428/000444E",
      court: {
        courtIdentityType: "code",
        courtCode: "2576"
      },
      dateOfConviction: "2011-09-26",
      defendant: {
        defendantType: "individual",
        defendantFirstNames: ["NIGEL"],
        defendantLastName: "NOLAN"
      },
      carryForward: {
        appearanceDate: "2011-12-01",
        court: {
          courtIdentityType: "code",
          courtCode: "2576"
        }
      },
      offences: [
        {
          courtOffenceSequenceNumber: 1,
          cjsOffenceCode: "OF61016",
          plea: "Not Guilty",
          adjudication: "Not Guilty",
          dateOfSentence: "2011-09-26",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 2006
            }
          ],
          offenceId: "3801d797-9e88-4c83-8784-40e0c3152116"
        },
        {
          courtOffenceSequenceNumber: 2,
          cjsOffenceCode: "PC53001",
          plea: "Not Guilty",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 2059
            }
          ],
          offenceId: "e7d3f9e1-78a2-4cf1-9363-122cdf6d6387"
        }
      ]
    },
    count: 1
  }),
  policeApi.mockUpdate("CXU02", {
    expectedRequest: {
      pncCheckName: "NOLAN",
      croNumber: "",
      crimeOffenceReferenceNumber: "",
      ownerCode: "01YZ",
      personUrn: "09/478F",
      courtCaseReference: "09/0413/000445H",
      court: {
        courtIdentityType: "code",
        courtCode: "2576"
      },
      dateOfConviction: "2011-09-26",
      defendant: {
        defendantType: "individual",
        defendantFirstNames: ["NIGEL"],
        defendantLastName: "NOLAN"
      },
      offences: [
        {
          courtOffenceSequenceNumber: 1,
          cjsOffenceCode: "TH68001",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-09-26",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 4011,
              disposalEffectiveDate: "2011-12-01"
            }
          ],
          offenceId: "305f9ef6-e035-4cd3-be02-6238a0ba0964"
        }
      ]
    },
    count: 1
  }),
  policeApi.mockUpdate("CXU01", {
    expectedRequest: {
      pncCheckName: "NOLAN",
      croNumber: "",
      arrestSummonsNumber: "09/0000/00/20002F",
      crimeOffenceReferenceNo: "",
      remandLocationFfss: "",
      ownerCode: "01YZ",
      personUrn: "09/478F",
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
        date: "2011-12-01",
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
      pncCheckName: "NOLAN",
      croNumber: "",
      gmh: "073ENQR000075RENQASIPNCA05A73000017300000120210827074373000001                                             050001865",
      gmt: "000016073ENQR000075R",
      personId: "e3c0483a-26bc-47ab-b827-d0a6fb5a5193",
      personUrn: "09/478F",
      reportId: "844bf523-ebc5-46a9-b632-19dd630ed48f",
      asn: "0900000000000020002F",
      ownerCode: "01VK",
      disposals: [
        {
          crimeOffenceReferenceNumber: "",
          courtCaseId: "221dcf44-668c-44fc-8d85-749a03a4a650",
          courtCaseReference: "09/0428/000444E",
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
              offenceId: "e71dd84e-13ec-4426-8cf1-2c6ffde8cc1b",
              adjudications: [
                {
                  appearanceNumber: 1,
                  adjudicationId: "a063f179-f8e5-4eba-9096-f5e3311fa78c",
                  disposalDate: "2011-09-26",
                  adjudication: "Not Guilty"
                }
              ],
              disposalResults: [
                {
                  disposalId: "7f6eb724-b89c-481c-bc86-728a338df1a8",
                  disposalCode: 2006,
                  disposalText: ""
                }
              ]
            }
          ]
        },
        {
          crimeOffenceReferenceNumber: "",
          courtCaseId: "221dcf44-668c-44fc-8d85-749a03a4a650",
          courtCaseReference: "21/2732/000001H",
          caseStatusMarker: "impending-prosecution-detail",
          court: {
            courtIdentityType: "code",
            courtCode: "0000"
          },
          offences: [
            {
              acpoOffenceCode: "11:6:4:1",
              courtOffenceSequenceNumber: 1,
              cjsOffenceCode: "PC53001",
              roleQualifiers: [],
              legislationQualifiers: [],
              offenceTic: 0,
              offenceStartDate: "2009-06-01",
              offenceId: "0b748d29-ddc9-4bc4-99bc-54542d557327",
              disposalResults: []
            }
          ]
        },
        {
          crimeOffenceReferenceNumber: "",
          courtCaseId: "221dcf44-668c-44fc-8d85-749a03a4a650",
          courtCaseReference: "09/0413/000445H",
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
              offenceStartDate: "2009-06-01",
              offenceId: "53ccbace-59ae-4d25-84bf-ecb71000ac69",
              adjudications: [
                {
                  appearanceNumber: 1,
                  adjudicationId: "7960255d-ce73-46e3-bd8c-e28eb525ea42",
                  disposalDate: "2011-09-26",
                  adjudication: "Guilty"
                }
              ],
              disposalResults: [
                {
                  disposalId: "45fbf9e3-f999-407b-8e38-c075c3468a78",
                  disposalCode: 4011,
                  disposalEffectiveDate: "2011-12-01",
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
  policeApi.mockUpdate("CXU02", {
    expectedRequest: {
      pncCheckName: "NOLAN",
      croNumber: "",
      crimeOffenceReferenceNumber: "",
      ownerCode: "01YZ",
      personUrn: "09/478F",
      courtCaseReference: "21/2732/000001H",
      court: {
        courtIdentityType: "code",
        courtCode: "2576"
      },
      dateOfConviction: "2011-12-01",
      defendant: {
        defendantType: "individual",
        defendantFirstNames: ["NIGEL"],
        defendantLastName: "NOLAN"
      },
      offences: [
        {
          courtOffenceSequenceNumber: 1,
          cjsOffenceCode: "PC53001",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-12-01",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 1002,
              disposalDuration: {
                units: "months",
                count: 10
              }
            }
          ],
          offenceId: "3d308522-237e-4e3d-b10d-1c6819591849"
        }
      ]
    },
    count: 1
  }),
  policeApi.mockUpdate("CXU04", {
    expectedRequest: {
      pncCheckName: "NOLAN",
      croNumber: "",
      crimeOffenceReferenceNumber: "",
      ownerCode: "01YZ",
      personUrn: "09/478F",
      courtCaseReference: "09/0413/000445H",
      court: {
        courtIdentityType: "code",
        courtCode: "2576"
      },
      appearanceDate: "2011-12-01",
      reasonForAppearance: "Sentence Deferred",
      offences: [
        {
          courtOffenceSequenceNumber: 1,
          cjsOffenceCode: "TH68001",
          disposalResults: [
            {
              disposalCode: 1002,
              disposalDuration: {
                units: "months",
                count: 10
              }
            }
          ],
          offenceId: "e94d93d8-6922-4b82-9c6b-f30806b2bbeb"
        }
      ]
    },
    count: 1
  })
]
