import extractAsnFromInputXml from "../../utils/extractAsnFromInputXml"
import type Bichard from "../../utils/world"

export default (_: string, { policeApi }: Bichard) => [
  policeApi.mockAsnQuery({
    matchRegex: "CXE01",
    response: `<?xml version="1.0" standalone="yes"?>
    <CXE01>
      <GMH>073ENQR000303RENQASIPNCA05A73000017300000120210901124573000001                                             050002284</GMH>
      <ASI>
        <FSC>K01ZD</FSC>
        <IDS>K21/4Y      JIMBOBJONES             </IDS>
        <CCR>K21/2732/4L                    </CCR>
        <COF>K001    12:15:16:1   RT88007 28112010                </COF>
        <ADJ>INOT GUILTY   GUILTY        260920110000 </ADJ>
        <DIS>I3096                                                                                                    </DIS>
        <DIS>I4047    26102011                                                                                        </DIS>
      </ASI>
      <GMT>000011073ENQR000303R</GMT>
    </CXE01>`,
    asn: extractAsnFromInputXml(`${__dirname}/input-message.xml`),
    expectedRequest: "",
    count: 1
  }),
  policeApi.mockUpdate("CXU04", {
    expectedRequest: {
      pncCheckName: "JIMBOBJONES",
      croNumber: "",
      crimeOffenceReferenceNumber: "",
      ownerCode: "01YZ",
      personUrn: "21/4Y",
      courtCaseReference: "21/2732/000004L",
      court: {
        courtIdentityType: "code",
        courtCode: "1910"
      },
      appearanceDate: "2011-10-26",
      reasonForAppearance: "Sentence Deferred",
      offences: [
        {
          courtOffenceSequenceNumber: 1,
          cjsOffenceCode: "RT88007",
          disposalResults: [
            {
              disposalCode: 3050
            },
            {
              disposalCode: 3070,
              disposalDuration: {
                units: "months",
                count: 12
              },
              disposalText: "FROM 26/09/11"
            }
          ],
          offenceId: "3f15846a-e6f8-46bd-9a2b-28c5b9922a0a"
        }
      ]
    },
    count: 1
  })
]
