import extractAsnFromInputXml from "../../utils/extractAsnFromInputXml"
import type Bichard from "../../utils/world"

export default (_: string, { policeApi }: Bichard) => [
  policeApi.mockAsnQuery({
    matchRegex: "CXE01",
    response: `<?xml version="1.0" standalone="yes"?>
    <CXE01>
      <GMH>073ENQR000711RENQASIPNCA05A73000017300000120210903102373000001                                             050002914</GMH>
      <ASI>
        <FSC>K01VK</FSC>
        <IDS>K21/16L     COMMUNITYORD            </IDS>
        <CCR>K21/2812/5J                    </CCR>
        <COF>K001    5:1:1:1      TH68023 01102009                </COF>
      </ASI>
      <GMT>000008073ENQR000711R</GMT>
    </CXE01>`,
    asn: extractAsnFromInputXml(`${__dirname}/input-message.xml`),
    expectedRequest: "",
    count: 1
  }),
  policeApi.mockUpdate("CXU02", {
    expectedRequest: {
      pncCheckName: "COMMUNITYORD",
      croNumber: "",
      crimeOffenceReferenceNumber: "",
      ownerCode: "01YZ",
      personUrn: "21/16L",
      courtCaseReference: "21/2812/000005J",
      court: {
        courtIdentityType: "code",
        courtCode: "2576"
      },
      dateOfConviction: "2009-10-26",
      defendant: {
        defendantType: "individual",
        defendantFirstNames: ["BREACH"],
        defendantLastName: "COMMUNITYORDERTWO"
      },
      offences: [
        {
          courtOffenceSequenceNumber: 1,
          cjsOffenceCode: "TH68023",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2009-10-26",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 1002,
              disposalDuration: {
                units: "months",
                count: 3
              }
            }
          ],
          offenceId: "434797ae-dc50-4581-8bbb-e61a808cc4d3"
        }
      ],
      additionalArrestOffences: [
        {
          asn: "11/01VK/01/376290V",
          additionalOffences: [
            {
              courtOffenceSequenceNumber: 0,
              offenceCode: {
                offenceCodeType: "cjs",
                cjsOffenceCode: "CJ03511"
              },
              committedOnBail: false,
              plea: "Guilty",
              adjudication: "Guilty",
              dateOfSentence: "2009-10-26",
              offenceTic: 0,
              offenceStartDate: "2009-10-01",
              disposalResults: [
                {
                  disposalCode: 1029
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
