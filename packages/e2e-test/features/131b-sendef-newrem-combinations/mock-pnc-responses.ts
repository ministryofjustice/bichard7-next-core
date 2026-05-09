import extractAsnFromInputXml from "../../utils/extractAsnFromInputXml"
import type Bichard from "../../utils/world"

export default (_: string, { policeApi }: Bichard) => [
  policeApi.mockAsnQuery({
    matchRegex: "CXE01",
    response: {
      pncCheckName: "SENDNEW",
      croNumber: "",
      gmh: "073ENQR000316RENQASIPNCA05A73000017300000120210901125773000001                                             050002311",
      gmt: "000010073ENQR000316R",
      personId: "6c251717-4e7b-4315-bb3c-554cec83d1bc",
      personUrn: "21/11F",
      reportId: "8de3d86f-7dac-4046-a298-c6ef35ceddd3",
      asn: "1101VK0100000376518T",
      ownerCode: "01VK",
      disposals: [
        {
          crimeOffenceReferenceNumber: "",
          courtCaseId: "bbaa794a-6a99-4153-a3d0-e4fcf55e43fc",
          courtCaseReference: "21/2812/000001E",
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
              offenceStartDate: "2010-09-01",
              offenceId: "067fe2af-f9c3-41b2-8bc4-0c7534a95a97",
              disposalResults: []
            },
            {
              acpoOffenceCode: "5:7:11:10",
              courtOffenceSequenceNumber: 2,
              cjsOffenceCode: "TH68151",
              roleQualifiers: [],
              legislationQualifiers: [],
              offenceTic: 0,
              offenceStartDate: "2010-09-01",
              offenceId: "82af0aa6-112a-4abf-a68e-b7158f880514",
              disposalResults: []
            },
            {
              acpoOffenceCode: "5:5:8:1",
              courtOffenceSequenceNumber: 3,
              cjsOffenceCode: "TH68010",
              roleQualifiers: [],
              legislationQualifiers: [],
              offenceTic: 0,
              offenceStartDate: "2010-09-01",
              offenceId: "13578e39-9814-4997-9275-2f7062a6fec5",
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
      pncCheckName: "SENDNEW",
      croNumber: "",
      crimeOffenceReferenceNumber: "",
      ownerCode: "01YZ",
      personUrn: "21/11F",
      courtCaseReference: "21/2812/000001E",
      court: {
        courtIdentityType: "code",
        courtCode: "2576"
      },
      dateOfConviction: "2010-09-26",
      defendant: {
        defendantType: "individual",
        defendantFirstNames: ["ONECCR"],
        defendantLastName: "SENDNEW"
      },
      offences: [
        {
          courtOffenceSequenceNumber: 1,
          cjsOffenceCode: "TH68006",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2010-09-26",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 4011,
              disposalEffectiveDate: "2010-10-26"
            }
          ],
          offenceId: "f9e1d78c-c68f-4df9-ad74-7884d8a5e684"
        },
        {
          courtOffenceSequenceNumber: 2,
          cjsOffenceCode: "TH68151",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2010-09-26",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 4011,
              disposalEffectiveDate: "2010-10-26"
            }
          ],
          offenceId: "7cdd6d44-0dc0-4872-a575-52fe313b8fc6"
        },
        {
          courtOffenceSequenceNumber: 3,
          cjsOffenceCode: "TH68010",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2010-09-26",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 4011,
              disposalEffectiveDate: "2010-10-26"
            }
          ],
          offenceId: "d08d7883-e9cc-4375-8062-3de1b9555200"
        }
      ]
    },
    count: 1
  }),
  policeApi.mockUpdate("CXU01", {
    expectedRequest: {
      pncCheckName: "SENDNEW",
      croNumber: "",
      arrestSummonsNumber: "11/01VK/01/376518T",
      crimeOffenceReferenceNo: "",
      remandLocationFfss: "",
      ownerCode: "01YZ",
      personUrn: "21/11F",
      remandDate: "2010-09-26",
      appearanceResult: "remanded-on-bail",
      bailConditions: [],
      currentAppearance: {
        court: {
          courtIdentityType: "code",
          courtCode: "2576"
        }
      },
      nextAppearance: {
        date: "2010-10-26",
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
      pncCheckName: "SENDNEW",
      croNumber: "",
      gmh: "073ENQR000317RENQASIPNCA05A73000017300000120210901125773000001                                             050002314",
      gmt: "000016073ENQR000317R",
      personId: "e6e81ecf-1432-4e07-a916-a1ceecdb5e23",
      personUrn: "21/11F",
      reportId: "04c1fa23-af9f-48fe-a3b9-a8a3656174eb",
      asn: "1101VK0100000376518T",
      ownerCode: "01VK",
      disposals: [
        {
          crimeOffenceReferenceNumber: "",
          courtCaseId: "9291ad48-8def-4cdd-ba1b-df73dee04cd0",
          courtCaseReference: "21/2812/000001E",
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
              offenceStartDate: "2010-09-01",
              offenceId: "50b8e78d-bb47-4d32-bf93-9a88add56928",
              adjudications: [
                {
                  appearanceNumber: 1,
                  adjudicationId: "e50dd528-6ee5-40a3-9dd9-826d81f1c884",
                  disposalDate: "2010-09-26",
                  adjudication: "Guilty"
                }
              ],
              disposalResults: [
                {
                  disposalId: "865db84b-1612-4a2d-9c90-854267bb9815",
                  disposalCode: 4011,
                  disposalEffectiveDate: "2010-10-26",
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
              offenceStartDate: "2010-09-01",
              offenceId: "43602e4e-3d3d-4db2-94c0-205eba79d67f",
              adjudications: [
                {
                  appearanceNumber: 1,
                  adjudicationId: "dce52ad8-dae4-42fa-82fe-afa3870b883f",
                  disposalDate: "2010-09-26",
                  adjudication: "Guilty"
                }
              ],
              disposalResults: [
                {
                  disposalId: "1b637378-3c8e-47b0-b9db-9b14f669770a",
                  disposalCode: 4011,
                  disposalEffectiveDate: "2010-10-26",
                  disposalText: ""
                }
              ]
            },
            {
              acpoOffenceCode: "5:5:8:1",
              courtOffenceSequenceNumber: 3,
              cjsOffenceCode: "TH68010",
              roleQualifiers: [],
              legislationQualifiers: [],
              plea: "Not Guilty",
              offenceTic: 0,
              offenceStartDate: "2010-09-01",
              offenceId: "568c844c-0f00-43c7-877d-2f619c3e34e3",
              adjudications: [
                {
                  appearanceNumber: 1,
                  adjudicationId: "9deec54d-4fe5-4d56-add3-20090e48e3fc",
                  disposalDate: "2010-09-26",
                  adjudication: "Guilty"
                }
              ],
              disposalResults: [
                {
                  disposalId: "6d0c47b6-4b30-4594-acac-a564cc523987",
                  disposalCode: 4011,
                  disposalEffectiveDate: "2010-10-26",
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
  })
]
