import extractAsnFromInputXml from "../../utils/extractAsnFromInputXml"
import type Bichard from "../../utils/world"

export default (_: string, { policeApi }: Bichard) => [
  policeApi.mockAsnQuery({
    matchRegex: "CXE01",
    response: `<?xml version="1.0" standalone="yes"?>
    <CXE01>
      <GMH>073ENQR000309RENQASIPNCA05A73000017300000120210901125273000001                                             050002297</GMH>
      <ASI>
        <FSC>K01ZD</FSC>
        <IDS>K21/7B      FOARDS                  </IDS>
        <CCR>K21/2732/7P                    </CCR>
        <COF>K001    8:7:45:2     PC00525 01072010    02072010    </COF>
      </ASI>
      <GMT>000008073ENQR000309R</GMT>
    </CXE01>`,
    asn: extractAsnFromInputXml(`${__dirname}/input-message.xml`),
    expectedRequest: "",
    count: 1
  }),
  policeApi.mockUpdate("CXU02", {
    expectedRequest: {
      pncCheckName: "FOARDS",
      croNumber: "",
      crimeOffenceReferenceNumber: "",
      ownerCode: "01YZ",
      personUrn: "21/7B",
      courtCaseReference: "21/2732/000007P",
      court: {
        courtIdentityType: "code",
        courtCode: "2576"
      },
      dateOfConviction: "2011-08-01",
      defendant: {
        defendantType: "individual",
        defendantFirstNames: ["LORNE"],
        defendantLastName: "FOARDSXX"
      },
      offences: [
        {
          courtOffenceSequenceNumber: 1,
          cjsOffenceCode: "PC00525",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-08-01",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 1040
            },
            {
              disposalCode: 1087
            }
          ],
          offenceId: "92b346b1-9949-4a9e-a62f-bd382b0fd364"
        }
      ]
    },
    count: 1
  })
]
