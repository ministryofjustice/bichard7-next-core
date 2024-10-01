import { mockUpdate } from "../../utils/pncMocks"

export default () => [
  {
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
    expectedRequest: "",
    count: 1
  },
  mockUpdate("CXU02", {
    expectedRequest:
      "<FSC>K01YZ</FSC><IDS>K21/17M     ORDERTOCONTI            </IDS><CCR>K21/2732/13W                   </CCR><COU>I2576                                                                       ORDERTOCONTINUE/STANDALONE                            260920110000</COU><CCH>K001              CJ88116 </CCH><ADJ>INOT GUILTY   GUILTY        260920110000 </ADJ><DIS>I1116    26092012          00                                                                            </DIS><DIS>I3101H100                  00                                                                            </DIS>",
    count: 1
  })
]
