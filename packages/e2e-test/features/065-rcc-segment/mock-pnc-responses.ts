import extractAsnFromInputXml from "../../utils/extractAsnFromInputXml"
import type Bichard from "../../utils/world"

export default (_: string, { policeApi }: Bichard) => [
  policeApi.mockAsnQuery({
    matchRegex: "CXE01",
    response: {
      pncCheckName: "INNOCUOUS",
      croNumber: "",
      gmh: "073ENQR000005RENQASIPNCA05A73000017300000120210920111073000001                                             050001759",
      gmt: "000008073ENQR000005R",
      personId: "e7cad1b8-8f9d-4093-9c22-6dc0be58da38",
      personUrn: "21/1V",
      reportId: "4f7f809d-e743-4e43-83e5-4fac4365a736",
      asn: "1101ZD0100000410826J",
      ownerCode: "01ZD",
      disposals: [
        {
          crimeOffenceReferenceNumber: "",
          courtCaseId: "0cb0fef7-0f7a-40bb-bfa5-f03b7b996fb4",
          courtCaseReference: "21/2732/000001H",
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
              offenceId: "6b292bf0-2e41-4836-aab3-1892567e2180",
              disposalResults: []
            }
          ]
        }
      ]
    },
    asn: extractAsnFromInputXml(`${__dirname}/input-message.xml`),
    expectedRequest: "",
    count: 1
  }),
  policeApi.mockUpdate("CXU02", {
    expectedRequest: {
      pncCheckName: "INNOCUOUS",
      croNumber: "",
      crimeOffenceReferenceNumber: "",
      ownerCode: "01YZ",
      personUrn: "21/1V",
      courtCaseReference: "21/2732/000001H",
      court: {
        courtIdentityType: "code",
        courtCode: "2576"
      },
      dateOfConviction: "2011-09-26",
      defendant: {
        defendantType: "individual",
        defendantFirstNames: ["MISTER"],
        defendantLastName: "INNOCUOUS"
      },
      referToCourtCase: {
        reference: "01ZD/5100008"
      },
      offences: [
        {
          courtOffenceSequenceNumber: 1,
          cjsOffenceCode: "TH68006",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 2060
            }
          ],
          offenceId: "d85fe2fc-31c4-4c2e-b120-7d434c4b37a4"
        }
      ],
      additionalArrestOffences: [
        {
          asn: "11/01ZD/01/410826J",
          additionalOffences: [
            {
              courtOffenceSequenceNumber: 0,
              offenceCode: {
                offenceCodeType: "cjs",
                cjsOffenceCode: "TH68072"
              },
              committedOnBail: false,
              plea: "Guilty",
              adjudication: "Guilty",
              dateOfSentence: "2011-09-26",
              offenceTic: 0,
              offenceStartDate: "2010-11-28",
              disposalResults: [
                {
                  disposalCode: 1015,
                  disposalFine: {
                    amount: 200
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
    }
  })
]
