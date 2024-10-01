import { mockUpdate } from "../../utils/pncMocks"

export default () => [
  {
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
    expectedRequest: "",
    count: 1
  },
  mockUpdate("CXU02", {
    expectedRequest:
      "<FSC>K01YZ</FSC><IDS>K21/15K     COMMUNITYORD            </IDS><CCR>K21/2812/4H                    </CCR><COU>I2576                                                                       COMMUNITYORDER/BREACH                                 260920080000</COU><CCH>K001              CJ88116 </CCH><ADJ>INOT GUILTY   GUILTY        260920080000 </ADJ><DIS>I1116                      00                                                                            </DIS><DIS>I3101H100                  00                                                                            </DIS>",
    count: 1
  })
]
