import extractAsnFromInputXml from "../../utils/extractAsnFromInputXml"
import type Bichard from "../../utils/world"

export default (_: string, { policeApi }: Bichard) => [
  policeApi.mockAsnQuery({
    matchRegex: "CXE01",
    response: {
      pncCheckName: "BREACHPLEANO",
      croNumber: "",
      gmh: "073ENQR000340RENQASIPNCA05A73000017300000120210901140973000001                                             050002362",
      gmt: "000009073ENQR000340R",
      personId: "cd5e9188-4431-4dff-a823-5c1cb1d0a92f",
      personUrn: "21/24V",
      reportId: "74dd3baa-8550-4352-9412-5d932e0eb693",
      asn: "1301ZD0100000449641X",
      ownerCode: "01ZD",
      disposals: [
        {
          crimeOffenceReferenceNumber: "",
          courtCaseId: "3335ed1e-eabe-4bbe-af66-226982812ac3",
          courtCaseReference: "21/2732/000019C",
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
              offenceId: "891ae5a8-e6b6-4180-84c2-c7ba1ea1c3c4",
              disposalResults: []
            },
            {
              acpoOffenceCode: "5:5:5:1",
              courtOffenceSequenceNumber: 2,
              cjsOffenceCode: "TH68006",
              roleQualifiers: [],
              legislationQualifiers: [],
              offenceTic: 0,
              offenceStartDate: "2010-10-01",
              offenceId: "9f3c9b49-a755-4715-b4b8-dac8350d1db5",
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
      pncCheckName: "BREACHPLEANO",
      croNumber: "",
      crimeOffenceReferenceNumber: "",
      ownerCode: "01YZ",
      personUrn: "21/24V",
      courtCaseReference: "21/2732/000019C",
      court: {
        courtIdentityType: "code",
        courtCode: "2576"
      },
      dateOfConviction: "2011-10-26",
      defendant: {
        defendantType: "individual",
        defendantFirstNames: ["OTHEROFFENCES"],
        defendantLastName: "BREACHPLEANOVERDICT"
      },
      carryForward: {
        appearanceDate: "2011-10-28",
        court: {
          courtIdentityType: "code",
          courtCode: "2576"
        }
      },
      offences: [
        {
          courtOffenceSequenceNumber: 1,
          cjsOffenceCode: "CJ03510",
          plea: "Guilty",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 2059
            }
          ],
          offenceId: "425857c9-1b58-4306-a65e-5709570cdcd1"
        },
        {
          courtOffenceSequenceNumber: 2,
          cjsOffenceCode: "TH68006",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-10-26",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 4027,
              disposalEffectiveDate: "2011-10-28"
            }
          ],
          offenceId: "11c016fc-1850-4074-a5fb-6ff00109ad66"
        }
      ]
    },
    count: 1
  }),
  policeApi.mockUpdate("CXU01", {
    expectedRequest: {
      pncCheckName: "BREACHPLEANO",
      croNumber: "",
      arrestSummonsNumber: "13/01ZD/01/449641X",
      crimeOffenceReferenceNo: "",
      remandLocationFfss: "",
      ownerCode: "01YZ",
      personUrn: "21/24V",
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
      pncCheckName: "BREACHPLEANO",
      croNumber: "",
      gmh: "073ENQR000341RENQASIPNCA05A73000017300000120210901140973000001                                             050002365",
      gmt: "000012073ENQR000341R",
      personId: "c6106166-d506-4834-b04e-59950de2be88",
      personUrn: "21/24V",
      reportId: "8748ee11-cc90-43c2-aaf6-9007a114a08d",
      asn: "1301ZD0100000449641X",
      ownerCode: "01ZD",
      disposals: [
        {
          crimeOffenceReferenceNumber: "",
          courtCaseId: "83859085-ba1f-45b5-9bee-c06f758aa1a1",
          courtCaseReference: "21/2732/000027L",
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
              offenceId: "17c6f292-845e-4e1d-80e2-81bac5c2614e",
              disposalResults: []
            }
          ]
        },
        {
          crimeOffenceReferenceNumber: "",
          courtCaseId: "83859085-ba1f-45b5-9bee-c06f758aa1a1",
          courtCaseReference: "21/2732/000019C",
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
              offenceStartDate: "2010-10-01",
              offenceId: "5c8c65c6-467e-413e-87c1-36bbfc81af75",
              adjudications: [
                {
                  appearanceNumber: 1,
                  adjudicationId: "15679527-2524-4392-a466-68eef9d2d88a",
                  disposalDate: "2011-10-26",
                  adjudication: "Guilty"
                }
              ],
              disposalResults: [
                {
                  disposalId: "21764515-6796-4355-806a-166c33192d6f",
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
      pncCheckName: "BREACHPLEANO",
      croNumber: "",
      arrestSummonsNumber: "13/01ZD/01/449641X",
      crimeOffenceReferenceNo: "",
      remandLocationFfss: "",
      ownerCode: "01YZ",
      personUrn: "21/24V",
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
        date: "2011-11-28",
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
      pncCheckName: "BREACHPLEANO",
      croNumber: "",
      gmh: "073ENQR000342RENQASIPNCA05A73000017300000120210901140973000001                                             050002367",
      gmt: "000012073ENQR000342R",
      personId: "8bfc1bd2-ba24-4649-b0cf-fe5ad39e6a82",
      personUrn: "21/24V",
      reportId: "f3a17d6f-56b3-4deb-a8e7-215851f6fbdd",
      asn: "1301ZD0100000449641X",
      ownerCode: "01ZD",
      disposals: [
        {
          crimeOffenceReferenceNumber: "",
          courtCaseId: "acec5b77-59c3-42d0-a1ad-11c73f263400",
          courtCaseReference: "21/2732/000027L",
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
              offenceId: "0d5390d4-2455-4a7d-a213-5e45c28c3645",
              disposalResults: []
            }
          ]
        },
        {
          crimeOffenceReferenceNumber: "",
          courtCaseId: "acec5b77-59c3-42d0-a1ad-11c73f263400",
          courtCaseReference: "21/2732/000019C",
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
              offenceStartDate: "2010-10-01",
              offenceId: "04aa34f1-6e82-48d6-9354-6ce2ec6218c5",
              adjudications: [
                {
                  appearanceNumber: 1,
                  adjudicationId: "88fa7dc5-33ff-47fd-a39e-92019245ea28",
                  disposalDate: "2011-10-26",
                  adjudication: "Guilty"
                }
              ],
              disposalResults: [
                {
                  disposalId: "9cad2b0e-f521-4df2-be6f-190d2ba791d2",
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
    asn: extractAsnFromInputXml(`${__dirname}/input-message-3.xml`),
    expectedRequest: "",
    count: 1
  }),
  policeApi.mockUpdate("CXU02", {
    expectedRequest: {
      pncCheckName: "BREACHPLEANO",
      croNumber: "",
      crimeOffenceReferenceNumber: "",
      ownerCode: "01YZ",
      personUrn: "21/24V",
      courtCaseReference: "21/2732/000027L",
      court: {
        courtIdentityType: "code",
        courtCode: "2576"
      },
      dateOfConviction: "2011-11-28",
      defendant: {
        defendantType: "individual",
        defendantFirstNames: ["OTHEROFFENCES"],
        defendantLastName: "BREACHPLEANOVERDICT"
      },
      offences: [
        {
          courtOffenceSequenceNumber: 1,
          cjsOffenceCode: "CJ03510",
          plea: "Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-11-28",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 1030
            }
          ],
          offenceId: "5284d8f8-c797-4b82-9a65-3814e7be5c0b"
        }
      ]
    },
    count: 1
  }),
  policeApi.mockUpdate("CXU04", {
    expectedRequest: {
      pncCheckName: "BREACHPLEANO",
      croNumber: "",
      crimeOffenceReferenceNumber: "",
      ownerCode: "01YZ",
      personUrn: "21/24V",
      courtCaseReference: "21/2732/000019C",
      court: {
        courtIdentityType: "code",
        courtCode: "2576"
      },
      appearanceDate: "2011-11-28",
      reasonForAppearance: "Sentence Deferred",
      offences: [
        {
          courtOffenceSequenceNumber: 1,
          cjsOffenceCode: "TH68006",
          disposalResults: [
            {
              disposalCode: 1015,
              disposalFine: {
                amount: 200
              }
            }
          ],
          offenceId: "69f0d503-a12c-493c-b6ee-a2cfeb0c7163"
        }
      ]
    },
    count: 1
  })
]
