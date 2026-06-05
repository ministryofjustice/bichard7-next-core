import { SET_BY_PROCESSOR } from "../../utils/constants"
import extractAsnFromInputXml from "../../utils/extractAsnFromInputXml"
import type Bichard from "../../utils/world"

export default (_: string, { policeApi }: Bichard) => [
  policeApi.mockAsnQuery({
    matchRegex: "CXE01",
    response: {
      pncCheckName: "LEBOWSKI",
      croNumber: "",
      gmh: "073ENQR000306RENQASIPNCA05A73000017300000120210901124873000001                                             050002291",
      gmt: "000010073ENQR000306R",
      personId: SET_BY_PROCESSOR,
      longPersonUrn: "2021/6A",
      reportId: SET_BY_PROCESSOR,
      asn: "1101ZD0100000410790V",
      ownerCode: "01ZD",
      disposals: [
        {
          crimeOffenceReferenceNumber: "",
          courtCaseId: SET_BY_PROCESSOR,
          courtCaseReference: "21/2732/000006N",
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
              offenceStartDate: "2010-11-28",
              offenceId: "b67905b8-76e7-477a-beab-7799895d33a5",
              disposalResults: []
            },
            {
              acpoOffenceCode: "5:7:11:10",
              courtOffenceSequenceNumber: 2,
              cjsOffenceCode: "TH68151",
              roleQualifiers: [],
              legislationQualifiers: [],
              offenceTic: 0,
              offenceStartDate: "2010-11-28",
              offenceId: "573447a9-f84c-48a3-891c-aa9b321ff4f0",
              disposalResults: []
            },
            {
              acpoOffenceCode: "12:15:13:1",
              courtOffenceSequenceNumber: 3,
              cjsOffenceCode: "RT88191",
              roleQualifiers: [],
              legislationQualifiers: [],
              offenceTic: 0,
              offenceStartDate: "2010-11-28",
              offenceId: "625b176a-c189-4dcb-a4ec-e9fd4e040899",
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
      pncCheckName: "LEBOWSKI",
      croNumber: "",
      crimeOffenceReferenceNumber: "",
      ownerCode: "01YZ",
      longPersonUrn: "2021/6A",
      courtCaseReference: "21/2732/000006N",
      court: {
        courtIdentityType: "code",
        courtCode: "2576"
      },
      dateOfConviction: "2011-09-25",
      defendant: {
        defendantType: "individual",
        defendantFirstNames: ["JEFFREY"],
        defendantLastName: "LEBOWSKI"
      },
      offences: [
        {
          courtOffenceSequenceNumber: 1,
          cjsOffenceCode: "TH68006",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-09-25",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 2007
            }
          ],
          offenceId: "8d498e79-8039-417c-a326-911249334087"
        },
        {
          courtOffenceSequenceNumber: 2,
          cjsOffenceCode: "TH68151",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-09-25",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 2007
            }
          ],
          offenceId: "1dd6ed94-a753-4b10-97f4-ac349b1df812"
        },
        {
          courtOffenceSequenceNumber: 3,
          cjsOffenceCode: "RT88191",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-09-25",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 2007
            }
          ],
          offenceId: "45e509be-29a4-4bcc-92bc-f735f7da34a7"
        }
      ]
    },
    count: 1
  }),
  policeApi.mockAsnQuery({
    matchRegex: "CXE01",
    response: {
      pncCheckName: "LEBOWSKI",
      croNumber: "",
      gmh: "073ENQR000307RENQASIPNCA05A73000017300000120210901124873000001                                             050002293",
      gmt: "000016073ENQR000307R",
      personId: SET_BY_PROCESSOR,
      longPersonUrn: "2021/6A",
      reportId: SET_BY_PROCESSOR,
      asn: "1101ZD0100000410790V",
      ownerCode: "01ZD",
      disposals: [
        {
          crimeOffenceReferenceNumber: "",
          courtCaseId: SET_BY_PROCESSOR,
          courtCaseReference: "21/2732/000006N",
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
              offenceStartDate: "2010-11-28",
              offenceId: "29287ea0-e6e3-4c63-9d8d-d502f6ae5be1",
              adjudications: [
                {
                  appearanceNumber: 1,
                  adjudicationId: "a974d2e5-0ac4-486c-a9ca-cd0e65f65882",
                  disposalDate: "2011-09-25",
                  adjudication: "Guilty"
                }
              ],
              disposalResults: [
                {
                  disposalId: "1d3e19a4-2481-412b-84ee-36a9a2e8b693",
                  disposalCode: 2007,
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
              offenceStartDate: "2010-11-28",
              offenceId: "7b0576e4-873b-4ab7-a128-891f078d2882",
              adjudications: [
                {
                  appearanceNumber: 1,
                  adjudicationId: "2871285b-dae2-4f9d-933d-95d1b30b6f68",
                  disposalDate: "2011-09-25",
                  adjudication: "Guilty"
                }
              ],
              disposalResults: [
                {
                  disposalId: "5c9e4efc-15e8-4df4-90c6-3a51410f81b5",
                  disposalCode: 2007,
                  disposalText: ""
                }
              ]
            },
            {
              acpoOffenceCode: "12:15:13:1",
              courtOffenceSequenceNumber: 3,
              cjsOffenceCode: "RT88191",
              roleQualifiers: [],
              legislationQualifiers: [],
              plea: "Not Guilty",
              offenceTic: 0,
              offenceStartDate: "2010-11-28",
              offenceId: "49965080-a632-42a1-ba07-4e86d6104aa1",
              adjudications: [
                {
                  appearanceNumber: 1,
                  adjudicationId: "2df7fb9c-deeb-4764-a9d8-ff8d05ccc761",
                  disposalDate: "2011-09-25",
                  adjudication: "Guilty"
                }
              ],
              disposalResults: [
                {
                  disposalId: "be551f4c-6b91-4967-9987-56a36d031333",
                  disposalCode: 2007,
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
  policeApi.mockUpdate("CXU03", {
    expectedRequest: {
      pncCheckName: "LEBOWSKI",
      croNumber: "",
      crimeOffenceReferenceNumber: "",
      ownerCode: "01YZ",
      longPersonUrn: "2021/6A",
      courtCaseReference: "21/2732/000006N",
      court: {
        courtIdentityType: "code",
        courtCode: "2576"
      },
      appearanceDate: "2011-10-26",
      reasonForAppearance: "Subsequently Varied",
      offences: [
        {
          courtOffenceSequenceNumber: 1,
          cjsOffenceCode: "TH68006",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-10-26",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 1015,
              disposalFine: {
                amount: 101
              }
            },
            {
              disposalCode: 3027,
              disposalEffectiveDate: "2011-09-25"
            }
          ],
          offenceId: "665ece7c-60f9-486c-872b-f68bc21c337d"
        },
        {
          courtOffenceSequenceNumber: 2,
          cjsOffenceCode: "TH68151",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-10-26",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 1015,
              disposalFine: {
                amount: 102
              }
            },
            {
              disposalCode: 3027,
              disposalEffectiveDate: "2011-09-25"
            }
          ],
          offenceId: "904dcc48-0e56-4fcb-8d53-93a7f5cd5060"
        },
        {
          courtOffenceSequenceNumber: 3,
          cjsOffenceCode: "RT88191",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-10-26",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 1015,
              disposalFine: {
                amount: 103
              }
            },
            {
              disposalCode: 3027,
              disposalEffectiveDate: "2011-09-25"
            }
          ],
          offenceId: "2ee6f868-76fd-4ab0-9b0e-15945a7ce62e"
        }
      ]
    },
    count: 1
  })
]
