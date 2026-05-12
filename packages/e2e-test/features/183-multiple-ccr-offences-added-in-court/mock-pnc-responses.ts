import { SET_BY_PROCESSOR } from "../../utils/constants"
import extractAsnFromInputXml from "../../utils/extractAsnFromInputXml"
import type Bichard from "../../utils/world"

export default (_: string, { policeApi }: Bichard) => [
  policeApi.mockAsnQuery({
    matchRegex: "CXE01",
    response: {
      pncCheckName: "LIVERPOOL",
      croNumber: "",
      gmh: "073ENQR000051RENQASIPNCA05A73000017300000120210827111573000001                                             050001811",
      gmt: "000011073ENQR000051R",
      personId: SET_BY_PROCESSOR,
      personUrn: "2012/20D",
      reportId: SET_BY_PROCESSOR,
      asn: "1200000000000000012Z",
      ownerCode: "01ZD",
      disposals: [
        {
          crimeOffenceReferenceNumber: "",
          courtCaseId: SET_BY_PROCESSOR,
          courtCaseReference: "12/2732/000030H",
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
              offenceId: "aa6b05a9-19df-4a65-9a3a-3c354005992b",
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
              offenceId: "070fd850-3e83-4641-9451-1a406289816b",
              disposalResults: []
            }
          ]
        },
        {
          crimeOffenceReferenceNumber: "",
          courtCaseId: SET_BY_PROCESSOR,
          courtCaseReference: "12/2732/000031J",
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
              offenceId: "9069956c-b64e-4201-b2c8-767844b95027",
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
      pncCheckName: "LIVERPOOL",
      croNumber: "",
      crimeOffenceReferenceNumber: "",
      ownerCode: "01YZ",
      personUrn: "2012/20D",
      courtCaseReference: "12/2732/000030H",
      court: {
        courtIdentityType: "code",
        courtCode: "2576"
      },
      dateOfConviction: "2009-10-01",
      defendant: {
        defendantType: "individual",
        defendantFirstNames: ["MARTIN"],
        defendantLastName: "LIVERPOOL"
      },
      offences: [
        {
          courtOffenceSequenceNumber: 1,
          cjsOffenceCode: "OF61016",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2009-10-01",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 4004,
              disposalEffectiveDate: "2009-10-08"
            }
          ],
          offenceId: "99b21489-fe0a-4dc7-9a6c-3aec412ba745"
        },
        {
          courtOffenceSequenceNumber: 2,
          cjsOffenceCode: "PC53001",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2009-10-01",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 4004,
              disposalEffectiveDate: "2009-10-08"
            }
          ],
          offenceId: "471a5436-c0b3-456d-aa5e-27613d004625"
        }
      ]
    },
    count: 1
  }),
  policeApi.mockUpdate("CXU01", {
    expectedRequest: {
      pncCheckName: "LIVERPOOL",
      croNumber: "",
      arrestSummonsNumber: "12/0000/00/12Z",
      crimeOffenceReferenceNo: "",
      remandLocationFfss: "",
      ownerCode: "01YZ",
      personUrn: "2012/20D",
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
        date: "2009-10-08",
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
      pncCheckName: "LIVERPOOL",
      croNumber: "",
      gmh: "073ENQR000143RENQASIPNCA05A73000017300000120210827111573000001                                             050002053",
      gmt: "000015073ENQR000143R",
      personId: SET_BY_PROCESSOR,
      personUrn: "2012/20D",
      reportId: SET_BY_PROCESSOR,
      asn: "1200000000000000012Z",
      ownerCode: "01ZD",
      disposals: [
        {
          crimeOffenceReferenceNumber: "",
          courtCaseId: SET_BY_PROCESSOR,
          courtCaseReference: "12/2732/000030H",
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
              offenceId: "b6ef66cc-672d-47e6-a114-e32c7252cab6",
              adjudications: [
                {
                  appearanceNumber: 1,
                  adjudicationId: "09a30d83-83bd-4aa4-a53e-b3c2c78e27aa",
                  disposalDate: "2009-10-01",
                  adjudication: "Guilty"
                }
              ],
              disposalResults: [
                {
                  disposalId: "43a927f9-8bb8-419d-a64e-1ba658357837",
                  disposalCode: 4004,
                  disposalEffectiveDate: "2009-10-08",
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
              offenceId: "d5a4c8c6-e4d9-4643-8b94-4c8510e2af1a",
              adjudications: [
                {
                  appearanceNumber: 1,
                  adjudicationId: "0265966a-d832-4ce3-8f4e-72e9c72a14af",
                  disposalDate: "2009-10-01",
                  adjudication: "Guilty"
                }
              ],
              disposalResults: [
                {
                  disposalId: "c99c8125-b363-4ffb-963c-591593f0da28",
                  disposalCode: 4004,
                  disposalEffectiveDate: "2009-10-08",
                  disposalText: ""
                }
              ]
            }
          ]
        },
        {
          crimeOffenceReferenceNumber: "",
          courtCaseId: SET_BY_PROCESSOR,
          courtCaseReference: "12/2732/000031J",
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
              offenceId: "d61f0d21-1d8b-4122-bdae-384e3f869cd1",
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
  policeApi.mockUpdate("CXU04", {
    expectedRequest: {
      pncCheckName: "LIVERPOOL",
      croNumber: "",
      crimeOffenceReferenceNumber: "",
      ownerCode: "01YZ",
      personUrn: "2012/20D",
      courtCaseReference: "12/2732/000030H",
      court: {
        courtIdentityType: "code",
        courtCode: "2576"
      },
      appearanceDate: "2009-10-08",
      reasonForAppearance: "Sentence Deferred",
      offences: [
        {
          courtOffenceSequenceNumber: 1,
          cjsOffenceCode: "OF61016",
          disposalResults: [
            {
              disposalCode: 1002,
              disposalDuration: {
                units: "months",
                count: 12
              }
            }
          ],
          offenceId: "d4999c29-37f4-4537-bebb-5b3f512027e4"
        },
        {
          courtOffenceSequenceNumber: 2,
          cjsOffenceCode: "PC53001",
          disposalResults: [
            {
              disposalCode: 1002,
              disposalDuration: {
                units: "months",
                count: 12
              }
            }
          ],
          offenceId: "7d6872b4-3db0-4229-86c7-6be37d6c93f5"
        }
      ]
    },
    count: 1
  }),
  policeApi.mockUpdate("CXU02", {
    expectedRequest: {
      pncCheckName: "LIVERPOOL",
      croNumber: "",
      crimeOffenceReferenceNumber: "",
      ownerCode: "01YZ",
      personUrn: "2012/20D",
      courtCaseReference: "12/2732/000031J",
      court: {
        courtIdentityType: "code",
        courtCode: "2576"
      },
      dateOfConviction: "2009-10-08",
      defendant: {
        defendantType: "individual",
        defendantFirstNames: ["MARTIN"],
        defendantLastName: "LIVERPOOL"
      },
      carryForward: {
        appearanceDate: "2009-10-12",
        court: {
          courtIdentityType: "code",
          courtCode: "2576"
        }
      },
      offences: [
        {
          courtOffenceSequenceNumber: 1,
          cjsOffenceCode: "TH68001",
          plea: "Not Guilty",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 2059
            }
          ],
          offenceId: "a0d0151e-afe1-4f16-997c-495284998ade"
        }
      ],
      additionalArrestOffences: [
        {
          asn: "12/0000/00/12Z",
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
              dateOfSentence: "2009-10-08",
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
      pncCheckName: "LIVERPOOL",
      croNumber: "",
      arrestSummonsNumber: "12/0000/00/12Z",
      crimeOffenceReferenceNo: "",
      remandLocationFfss: "",
      ownerCode: "01YZ",
      personUrn: "2012/20D",
      remandDate: "2009-10-08",
      appearanceResult: "remanded-on-bail",
      bailConditions: [],
      currentAppearance: {
        court: {
          courtIdentityType: "code",
          courtCode: "2576"
        }
      },
      nextAppearance: {
        date: "2009-10-12",
        court: {
          courtIdentityType: "code",
          courtCode: "2576"
        }
      }
    },
    count: 1
  })
]
