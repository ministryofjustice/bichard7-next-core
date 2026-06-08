import { SET_BY_PROCESSOR } from "../../utils/constants"
import extractAsnFromInputXml from "../../utils/extractAsnFromInputXml"
import type Bichard from "../../utils/world"

export default (_: string, { policeApi }: Bichard) => [
  policeApi.mockAsnQuery({
    matchRegex: "CXE01",
    response: {
      pncCheckName: "NOLAN",
      croNumber: "",
      gmh: "073ENQR000134RENQASIPNCA05A73000017300000120210831090973000001                                             050001952",
      gmt: "000011073ENQR000134R",
      personId: SET_BY_PROCESSOR,
      longPersonUrn: "2009/478F",
      reportId: SET_BY_PROCESSOR,
      asn: "0900000000000020002F",
      ownerCode: "01VK",
      disposals: [
        {
          crimeOffenceReferenceNumber: "",
          courtCaseId: SET_BY_PROCESSOR,
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
              offenceId: "8612b68e-465b-40b4-9ad5-7eccfdcd5ceb",
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
              offenceId: "75ca37b1-1043-4e9b-8ae2-33fc5d12f13e",
              disposalResults: []
            }
          ]
        },
        {
          crimeOffenceReferenceNumber: "",
          courtCaseId: SET_BY_PROCESSOR,
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
              offenceId: "3a433ebc-56de-4841-a1ac-19a4a6c8564d",
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
      longPersonUrn: "2009/478F",
      courtCaseReference: "09/0428/000444E",
      court: {
        courtIdentityType: "code",
        courtCode: "2576"
      },
      dateOfConviction: "2009-10-01",
      defendant: {
        defendantType: "individual",
        defendantFirstNames: ["NIGEL"],
        defendantLastName: "NOLAN"
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
          cjsOffenceCode: "OF61016",
          plea: "Not Guilty",
          adjudication: "Not Guilty",
          dateOfSentence: "2009-10-01",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 2006
            }
          ],
          offenceId: "964eb9d9-84c1-45c5-8f30-d66aa07492a6"
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
          offenceId: "cfda247a-ab72-45ee-a01b-1b3d85e1fb2e"
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
      longPersonUrn: "2009/478F",
      courtCaseReference: "09/0413/000445H",
      court: {
        courtIdentityType: "code",
        courtCode: "2576"
      },
      dateOfConviction: "2009-10-01",
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
          dateOfSentence: "2009-10-01",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 4011,
              disposalEffectiveDate: "2009-11-01"
            }
          ],
          offenceId: "e93a9df2-7217-43ef-8aa0-b0ec3d24f13b"
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
      longPersonUrn: "2009/478F",
      remandDate: "2009-10-01",
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
      pncCheckName: "NOLAN",
      croNumber: "",
      gmh: "073ENQR000135RENQASIPNCA05A73000017300000120210831090973000001                                             050001956",
      gmt: "000016073ENQR000135R",
      personId: SET_BY_PROCESSOR,
      longPersonUrn: "2009/478F",
      reportId: SET_BY_PROCESSOR,
      asn: "0900000000000020002F",
      ownerCode: "01VK",
      disposals: [
        {
          crimeOffenceReferenceNumber: "",
          courtCaseId: SET_BY_PROCESSOR,
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
              offenceId: "8a5fcb20-198e-4f1f-9af2-a4e3851eee28",
              adjudications: [
                {
                  appearanceNumber: 1,
                  adjudicationId: "7994912f-4b08-4086-83e7-15a1fcc50072",
                  disposalDate: "2009-10-01",
                  adjudication: "Not Guilty"
                }
              ],
              disposalResults: [
                {
                  disposalId: "64903bae-9f32-4dca-bec7-d7ce0bc40e29",
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
              offenceId: "c866c22e-47c3-4b1a-8510-0241191efa90",
              disposalResults: []
            }
          ]
        },
        {
          crimeOffenceReferenceNumber: "",
          courtCaseId: SET_BY_PROCESSOR,
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
              offenceId: "253841c3-1678-4ff3-9c3a-7d4f7b629135",
              adjudications: [
                {
                  appearanceNumber: 1,
                  adjudicationId: "44455faa-286f-4c88-ae3b-d7e062b2a838",
                  disposalDate: "2009-10-01",
                  adjudication: "Guilty"
                }
              ],
              disposalResults: [
                {
                  disposalId: "ab3795ca-fcb5-406a-9f0b-c82040d9e7a4",
                  disposalCode: 4011,
                  disposalEffectiveDate: "2009-11-01",
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
      longPersonUrn: "2009/478F",
      courtCaseReference: "21/2732/000001H",
      court: {
        courtIdentityType: "code",
        courtCode: "2576"
      },
      dateOfConviction: "2009-11-01",
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
          dateOfSentence: "2009-11-01",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 1002,
              disposalDuration: {
                units: "months",
                count: 9
              }
            }
          ],
          offenceId: "fdd301fc-e1ec-4261-8247-90a81554f5cf"
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
      longPersonUrn: "2009/478F",
      courtCaseReference: "09/0413/000445H",
      court: {
        courtIdentityType: "code",
        courtCode: "2576"
      },
      appearanceDate: "2009-11-01",
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
          offenceId: "08d259bf-ec0a-49ff-b442-7a6836b1af66"
        }
      ]
    },
    count: 1
  })
]
