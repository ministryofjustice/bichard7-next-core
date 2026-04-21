import extractAsnFromInputXml from "../../utils/extractAsnFromInputXml"
import type Bichard from "../../utils/world"

export default (_: string, { policeApi }: Bichard) => [
  policeApi.mockAsnQuery({
    matchRegex: "CXE01",
    response: `<?xml version="1.0" standalone="yes"?>
    <CXE01>
      <GMH>073ENQR000308RENQASIPNCA05A73000017300000120210901125273000001                                             050002295</GMH>
      <ASI>
        <FSC>K01ZD</FSC>
        <IDS>K21/8C      FOARDS                  </IDS>
        <CCR>K21/2732/8Q                    </CCR>
        <COF>K001    1:8:11:2     CJ88116 28112010                </COF>
      </ASI>
      <GMT>000008073ENQR000308R</GMT>
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
      personUrn: "21/8C",
      courtCaseReference: "21/2732/000008Q",
      court: {
        courtIdentityType: "code",
        courtCode: "2576"
      },
      dateOfConviction: "2011-09-26",
      defendant: {
        defendantType: "individual",
        defendantFirstNames: ["LORNE"],
        defendantLastName: "FOARDS"
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
              disposalCode: 1018,
              disposalDuration: {
                units: "months",
                count: 12
              }
            }
          ],
          offenceId: "6b831cc0-eaa8-4c04-ad22-a132478fa7e5"
        }
      ]
    },
    count: 1
  })
]
