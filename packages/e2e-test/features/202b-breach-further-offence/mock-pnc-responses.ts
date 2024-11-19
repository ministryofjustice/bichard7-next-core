import { mockUpdate } from "../../utils/pncMocks"

export default () => [
  {
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
    expectedRequest: "",
    count: 1
  },
  mockUpdate("CXU02", {
    expectedRequest:
      "<FSC>K01YZ</FSC><IDS>K21/16L     COMMUNITYORD            </IDS><CCR>K21/2812/5J                    </CCR><COU>I2576                                                                       COMMUNITYORDERTWO/BREACH                              261020090000</COU><CCH>K001              TH68023 </CCH><ADJ>INOT GUILTY   GUILTY        261020090000 </ADJ><DIS>I1002M3                    00                                                                            </DIS><ASR>K11/01VK/01/376290V                    </ASR><ACH>I                                                                                                                                            CJ03511                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     NKINGSTON HIGH STREET                                                                                                                                                                                                                   01VK01102009                </ACH><ADJ>IGUILTY       GUILTY        261020090000 </ADJ><DIS>I1029                      00                                                                            </DIS>",
    count: 1
  })
]
