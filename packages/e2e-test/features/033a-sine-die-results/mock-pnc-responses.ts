import { SET_BY_PROCESSOR } from "../../utils/constants"
import extractAsnFromInputXml from "../../utils/extractAsnFromInputXml"
import type Bichard from "../../utils/world"

export default (_: string, { policeApi }: Bichard) => [
  policeApi.mockAsnQuery({
    matchRegex: "CXE01",
    response: {
      pncCheckName: "LEBOWSKI",
      croNumber: "",
      gmh: "073ENQR000307RENQASIPNCA05A73000017300000120210901124873000001                                             050002293",
      gmt: "000016073ENQR000307R",
      personId: SET_BY_PROCESSOR,
      personUrn: "21/6A",
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
              offenceId: "8d01e875-5c0a-4a2a-aa25-7dd5aeaed2af",
              adjudications: [
                {
                  appearanceNumber: 1,
                  adjudicationId: "7b07fb01-5ead-4aed-9107-ff9d7bb845c7",
                  disposalDate: "2011-09-25",
                  adjudication: "Guilty"
                }
              ],
              disposalResults: [
                {
                  disposalId: "fffe81d2-1277-4680-bb04-372a71680b87",
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
              offenceId: "e0457731-e55c-4174-96eb-5030661f222f",
              adjudications: [
                {
                  appearanceNumber: 1,
                  adjudicationId: "2ddfa2a4-b759-4244-9dcd-8860eadc2d3d",
                  disposalDate: "2011-09-25",
                  adjudication: "Guilty"
                }
              ],
              disposalResults: [
                {
                  disposalId: "3451a1c2-65d6-4bb2-874d-4b3480b7bf15",
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
              offenceId: "17098a7b-8a46-4f1a-af5b-1d81e010b8f3",
              adjudications: [
                {
                  appearanceNumber: 1,
                  adjudicationId: "606f6317-4a57-4398-aeb5-1c7e406234e2",
                  disposalDate: "2011-09-25",
                  adjudication: "Guilty"
                }
              ],
              disposalResults: [
                {
                  disposalId: "35b10626-01c9-4626-baec-ec458aa4f25d",
                  disposalCode: 2007,
                  disposalText: ""
                }
              ]
            }
          ]
        }
      ]
    },
    asn: extractAsnFromInputXml(`${__dirname}/input-message.xml`),
    expectedRequest: "",
    count: 1
  }),
  policeApi.mockUpdate("CXU03", {
    expectedRequest: {
      pncCheckName: "LEBOWSKI",
      croNumber: "",
      crimeOffenceReferenceNumber: "",
      ownerCode: "01YZ",
      personUrn: "21/6A",
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
          offenceId: "546ee081-bd01-4aec-9ec0-063fadc94f2e"
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
          offenceId: "503db9f8-b5ae-4a1f-b48a-3a430c5ab369"
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
          offenceId: "5542a654-370e-4d88-8968-e706851605f8"
        }
      ]
    },
    count: 1
  })
]
