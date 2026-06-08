import { SET_BY_PROCESSOR } from "../../utils/constants"
import extractAsnFromInputXml from "../../utils/extractAsnFromInputXml"
import type Bichard from "../../utils/world"

export default (_: string, { policeApi }: Bichard) => [
  policeApi.mockAsnQuery({
    matchRegex: "CXE01",
    response: {
      pncCheckName: "ADDOFFSENNOP",
      croNumber: "",
      gmh: "073ENQR000335RENQASIPNCA05A73000017300000120210901140673000001                                             050002351",
      gmt: "000009073ENQR000335R",
      personId: SET_BY_PROCESSOR,
      longPersonUrn: "2021/22T",
      reportId: SET_BY_PROCESSOR,
      asn: "1201ZD0100000445748R",
      ownerCode: "01ZD",
      disposals: [
        {
          crimeOffenceReferenceNumber: "",
          courtCaseId: SET_BY_PROCESSOR,
          courtCaseReference: "21/2732/000017A",
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
              offenceId: "8bd6c08e-428d-4ab6-8640-a600ea6f42e4",
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
              offenceId: "b4178525-ea06-493c-8687-23116b922aa1",
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
      pncCheckName: "ADDOFFSENNOP",
      croNumber: "",
      crimeOffenceReferenceNumber: "",
      ownerCode: "01YZ",
      longPersonUrn: "2021/22T",
      courtCaseReference: "21/2732/000017A",
      court: {
        courtIdentityType: "code",
        courtCode: "2576"
      },
      dateOfConviction: "2011-09-26",
      defendant: {
        defendantType: "individual",
        defendantFirstNames: ["NOEXCEPTION"],
        defendantLastName: "ADDOFFSENNOPNCADJ"
      },
      offences: [
        {
          courtOffenceSequenceNumber: 1,
          cjsOffenceCode: "TH68006",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-09-26",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 4047,
              disposalEffectiveDate: "2011-10-26"
            }
          ],
          offenceId: "c725586d-37f2-42f7-a06c-6f24d0b89134"
        },
        {
          courtOffenceSequenceNumber: 2,
          cjsOffenceCode: "TH68151",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-09-26",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 4047,
              disposalEffectiveDate: "2011-10-26"
            }
          ],
          offenceId: "5a52ec68-1f38-440d-b393-4a4a79d939ba"
        }
      ]
    },
    count: 1
  }),
  policeApi.mockUpdate("CXU01", {
    expectedRequest: {
      pncCheckName: "ADDOFFSENNOP",
      croNumber: "",
      arrestSummonsNumber: "12/01ZD/01/445748R",
      crimeOffenceReferenceNo: "",
      remandLocationFfss: "",
      ownerCode: "01YZ",
      longPersonUrn: "2021/22T",
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
        date: "2011-10-26",
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
      pncCheckName: "ADDOFFSENNOP",
      croNumber: "",
      gmh: "073ENQR000336RENQASIPNCA05A73000017300000120210901140673000001                                             050002354",
      gmt: "000013073ENQR000336R",
      personId: SET_BY_PROCESSOR,
      longPersonUrn: "2021/22T",
      reportId: SET_BY_PROCESSOR,
      asn: "1201ZD0100000445748R",
      ownerCode: "01ZD",
      disposals: [
        {
          crimeOffenceReferenceNumber: "",
          courtCaseId: SET_BY_PROCESSOR,
          courtCaseReference: "21/2732/000017A",
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
              offenceId: "c645dd14-cbdc-43fc-a2fc-f0569dfc0433",
              adjudications: [
                {
                  appearanceNumber: 1,
                  adjudicationId: "f76becf7-03c1-47f9-bd03-5fb8473a05d1",
                  disposalDate: "2011-09-26",
                  adjudication: "Guilty"
                }
              ],
              disposalResults: [
                {
                  disposalId: "e0ca0852-6bf8-4d7f-bb55-51d41ace46aa",
                  disposalCode: 4047,
                  disposalEffectiveDate: "2011-10-26",
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
              offenceId: "fa530e29-47bf-490e-970b-10632a075d70",
              adjudications: [
                {
                  appearanceNumber: 1,
                  adjudicationId: "5ead318a-8c69-4df2-9fc5-21df7d6d069b",
                  disposalDate: "2011-09-26",
                  adjudication: "Guilty"
                }
              ],
              disposalResults: [
                {
                  disposalId: "8de1d960-028a-4ed9-ba2a-9305849835e7",
                  disposalCode: 4047,
                  disposalEffectiveDate: "2011-10-26",
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
  policeApi.mockUpdate("CXU04", {
    expectedRequest: {
      pncCheckName: "ADDOFFSENNOP",
      croNumber: "",
      crimeOffenceReferenceNumber: "",
      ownerCode: "01YZ",
      longPersonUrn: "2021/22T",
      courtCaseReference: "21/2732/000017A",
      court: {
        courtIdentityType: "code",
        courtCode: "2576"
      },
      appearanceDate: "2011-10-26",
      reasonForAppearance: "Sentence Deferred",
      offences: [
        {
          courtOffenceSequenceNumber: 1,
          cjsOffenceCode: "TH68006",
          disposalResults: [
            {
              disposalCode: 1015,
              disposalFine: {
                amount: 100
              }
            }
          ],
          offenceId: "84f553cc-e86c-4964-8f57-5682227d666a"
        },
        {
          courtOffenceSequenceNumber: 2,
          cjsOffenceCode: "TH68151",
          disposalResults: [
            {
              disposalCode: 1015,
              disposalFine: {
                amount: 200
              }
            }
          ],
          offenceId: "75c71b1b-f8a3-4790-9d67-03994e0898c4"
        }
      ]
    },
    count: 1
  })
]
