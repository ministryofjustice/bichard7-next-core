import extractAsnFromInputXml from "../../utils/extractAsnFromInputXml"
import type Bichard from "../../utils/world"

export default (_: string, { policeApi }: Bichard) => [
  policeApi.mockAsnQuery({
    matchRegex: "CXE01",
    response: `<?xml version="1.0" standalone="yes"?>
    <CXE01>
      <GMH>073ENQR000311RENQASIPNCA05A73000017300000120210901125573000001                                             050002301</GMH>
      <ASI>
        <FSC>K01VK</FSC>
        <IDS>K21/9D      CHANGES                 </IDS>
        <CCR>K21/2769/9H                    </CCR>
        <COF>K001    5:5:5:1      TH68006 28112006                </COF>
        <COF>K002    5:7:11:10    TH68151 28112006                </COF>
        <COF>K003    12:15:13:1   RT88191 28112006                </COF>
      </ASI>
      <GMT>000010073ENQR000311R</GMT>
    </CXE01>`,
    asn: extractAsnFromInputXml(`${__dirname}/input-message.xml`),
    expectedRequest: "",
    count: 1
  }),
  policeApi.mockUpdate("CXU02", {
    expectedRequest: {
      pncCheckName: "CHANGES",
      croNumber: "",
      crimeOffenceReferenceNumber: "",
      ownerCode: "01YZ",
      personUrn: "21/9D",
      courtCaseReference: "21/2769/000009H",
      court: {
        courtIdentityType: "code",
        courtCode: "2574"
      },
      dateOfConviction: "2008-09-26",
      defendant: {
        defendantType: "individual",
        defendantFirstNames: ["PSACODE"],
        defendantLastName: "CHANGES"
      },
      offences: [
        {
          courtOffenceSequenceNumber: 1,
          cjsOffenceCode: "TH68006",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2008-09-26",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 1016
            }
          ],
          offenceId: "28fa5e6f-cc15-4ea0-83e0-a2b298384a0b"
        },
        {
          courtOffenceSequenceNumber: 2,
          cjsOffenceCode: "TH68151",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2008-09-26",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 1015,
              disposalFine: {
                amount: 100
              }
            }
          ],
          offenceId: "3578e403-8909-4048-a5e4-cee380aec692"
        },
        {
          courtOffenceSequenceNumber: 3,
          cjsOffenceCode: "RT88191",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2008-09-26",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 1015,
              disposalFine: {
                amount: 200
              }
            }
          ],
          offenceId: "8531abe6-a99a-48ff-9ca2-a9f279d2515c"
        }
      ],
      additionalArrestOffences: [
        {
          asn: "10/01VK/01/375807W",
          additionalOffences: [
            {
              courtOffenceSequenceNumber: 0,
              offenceCode: {
                offenceCodeType: "cjs",
                cjsOffenceCode: "TH68006"
              },
              committedOnBail: false,
              plea: "Not Guilty",
              adjudication: "Not Guilty",
              dateOfSentence: "2008-09-26",
              offenceTic: 0,
              offenceStartDate: "2006-11-29",
              disposalResults: [
                {
                  disposalCode: 2004
                }
              ],
              locationFsCode: "01VK",
              locationText: {
                locationText: "KINGSTON HIGH STREET"
              }
            },
            {
              courtOffenceSequenceNumber: 0,
              offenceCode: {
                offenceCodeType: "cjs",
                cjsOffenceCode: "RT88026"
              },
              committedOnBail: false,
              plea: "Not Guilty",
              adjudication: "Guilty",
              dateOfSentence: "2008-09-26",
              offenceTic: 0,
              offenceStartDate: "2006-11-28",
              disposalResults: [
                {
                  disposalCode: 1015,
                  disposalFine: {
                    amount: 300
                  }
                }
              ],
              locationFsCode: "01VK",
              locationText: {
                locationText: "KINGSTON HIGH STREET"
              }
            }
          ]
        }
      ]
    },
    count: 1
  })
]
