import extractAsnFromInputXml from "../../utils/extractAsnFromInputXml"
import type Bichard from "../../utils/world"

export default (_: string, { policeApi }: Bichard) => [
  policeApi.mockAsnQuery({
    matchRegex: "CXE01",
    response: `<?xml version="1.0" standalone="yes"?>
    <CXE01>
      <GMH>073ENQR000326RENQASIPNCA05A73000017300000120210901131473000001                                             050002331</GMH>
      <ASI>
        <FSC>K01ZD</FSC>
        <IDS>K21/17M     ORDERTOCONTI            </IDS>
        <CCR>K21/2732/13W                   </CCR>
        <COF>K001    1:8:11:2     CJ88116 28112010                </COF>
      </ASI>
      <GMT>000008073ENQR000326R</GMT>
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
      personUrn: "21/17M",
      courtCaseReference: "21/2732/000013W",
      court: {
        courtIdentityType: "code",
        courtCode: "2576"
      },
      dateOfConviction: "2011-09-26",
      defendant: {
        defendantType: "individual",
        defendantFirstNames: ["STANDALONE"],
        defendantLastName: "ORDERTOCONTINUE"
      },
      offences: [
        {
          courtOffenceSequenceNumber: 1,
          cjsOffenceCode: "CJ88116",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-09-26",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 1116,
              disposalEffectiveDate: "2012-09-26"
            },
            {
              disposalCode: 3101,
              disposalDuration: {
                units: "hours",
                count: 100
              }
            }
          ],
          offenceId: "a8c6fa09-d7e0-4f43-9708-6abe1aa49e11"
        }
      ]
    },
    count: 1
  })
]
