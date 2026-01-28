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
    expectedRequest:
      "<FSC>K01YZ</FSC><IDS>K21/18N     ORDERTOCONTI            </IDS><CCR>K21/2812/4H                    </CCR><COU>I2576                                                                       ORDERTOCONTINUETWO/STANDALONE                         261020090000</COU><CCH>K001              CJ03510 </CCH><ADJ>IGUILTY       GUILTY        261020090000 </ADJ><DIS>I1030                      00                                                                            </DIS>",
    count: 1
  })
]
