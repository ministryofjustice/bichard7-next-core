import extractAsnFromInputXml from "../../utils/extractAsnFromInputXml"
import type Bichard from "../../utils/world"

export default (_: string, { policeApi }: Bichard) => [
  policeApi.mockAsnQuery({
    matchRegex: "CXE01",
    response: `<?xml version="1.0" standalone="yes"?>
    <CXE01>
      <GMH>073ENQR000710RENQASIPNCA05A73000017300000120210903102373000001                                             050002912</GMH>
      <ASI>
        <FSC>K01VK</FSC>
        <IDS>K21/15K     COMMUNITYORD            </IDS>
        <CCR>K21/2812/4H                    </CCR>
        <COF>K001    1:8:11:2     CJ88116 28112006                </COF>
      </ASI>
      <GMT>000008073ENQR000710R</GMT>
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
      personUrn: "21/15K",
      courtCaseReference: "21/2812/000004H",
      court: {
        courtIdentityType: "code",
        courtCode: "2576"
      },
      dateOfConviction: "2008-09-26",
      defendant: {
        defendantType: "individual",
        defendantFirstNames: ["BREACH"],
        defendantLastName: "COMMUNITYORDER"
      },
      offences: [
        {
          courtOffenceSequenceNumber: 1,
          cjsOffenceCode: "CJ88116",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2008-09-26",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 1116
            },
            {
              disposalCode: 3101,
              disposalDuration: {
                units: "hours",
                count: 100
              }
            }
          ],
          offenceId: "e5d4e33c-2374-45ee-976b-aeb02f270da7"
        }
      ]
    },
    count: 1
  })
]
