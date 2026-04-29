import extractAsnFromInputXml from "../../utils/extractAsnFromInputXml"
import type Bichard from "../../utils/world"

export default (_: string, { policeApi }: Bichard) => [
  policeApi.mockAsnQuery({
    matchRegex: "CXE01",
    response: `<?xml version="1.0" standalone="yes"?>
    <CXE01>
      <GMH>073ENQR000327RENQASIPNCA05A73000017300000120210901131473000001                                             050002333</GMH>
      <ASI>
        <FSC>K01VK</FSC>
        <IDS>K21/18N     ORDERTOCONTI            </IDS>
        <CCR>K21/2812/4H                    </CCR>
        <COF>K001    8:7:69:3     CJ03510 01102009                </COF>
      </ASI>
      <GMT>000008073ENQR000327R</GMT>
    </CXE01>`,
    asn: extractAsnFromInputXml(`${__dirname}/input-message.xml`),
    expectedRequest: "",
    count: 1
  }),
  policeApi.mockUpdate("CXU02", {
    expectedRequest: {
      pncCheckName: "ORDERTOCONTI",
      croNumber: "",
      crimeOffenceReferenceNumber: "",
      ownerCode: "01YZ",
      personUrn: "21/18N",
      courtCaseReference: "21/2812/000004H",
      court: {
        courtIdentityType: "code",
        courtCode: "2576"
      },
      dateOfConviction: "2009-10-26",
      defendant: {
        defendantType: "individual",
        defendantFirstNames: ["STANDALONE"],
        defendantLastName: "ORDERTOCONTINUETWO"
      },
      offences: [
        {
          courtOffenceSequenceNumber: 1,
          cjsOffenceCode: "CJ03510",
          plea: "Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2009-10-26",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 1030
            }
          ],
          offenceId: "6de99c69-30c5-4123-add6-79846a5db258"
        }
      ]
    },
    count: 1
  })
]
