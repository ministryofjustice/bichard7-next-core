import { mockUpdate } from "../../utils/pncMocks"

export default () => [
  {
    matchRegex: "CXE01",
    response: `<?xml version="1.0" standalone="yes"?>
    <CXE01>
      <GMH>073ENQR000731RENQASIPNCA05A73000017300000120210903102873000001                                             050002955</GMH>
      <ASI>
        <FSC>K01ZD</FSC>
        <IDS>K21/24V     THREEZEROFIV            </IDS>
        <CCR>K21/2732/18B                   </CCR>
        <COF>K001    5:5:5:1      TH68006 28112010                </COF>
      </ASI>
      <GMT>000008073ENQR000731R</GMT>
    </CXE01>`,
    expectedRequest: "",
    count: 1
  },
  mockUpdate("CXU02", {
    expectedRequest:
      "<FSC>K01YZ</FSC><IDS>K21/24V     THREEZEROFIV            </IDS><CCR>K21/2732/18B                   </CCR><COU>I2576                                                                       THREEZEROFIVETWO/ADJPOSTJUDGE                         260920110000</COU><CCH>K001              TH68006 </CCH><ADJ>INOT GUILTY   GUILTY        260920110000 </ADJ><DIS>I4004    08102011          00                                                                            </DIS>",
    count: 1
  }),
  mockUpdate("CXU01", {
    expectedRequest:
      "<FSC>K01YZ</FSC><IDS>K21/24V     THREEZEROFIV            </IDS><ASR>K11/01ZD/01/500009X                    </ASR><REM>I26092011C    2576                                                                       081020112576                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      0000                                                                                                                                                                              </REM>",
    count: 1
  }),
  {
    matchRegex: "CXE01",
    response: `<?xml version="1.0" standalone="yes"?>
    <CXE01>
      <GMH>073ENQR000732RENQASIPNCA05A73000017300000120210903102873000001                                             050002958</GMH>
      <ASI>
        <FSC>K01ZD</FSC>
        <IDS>K21/24V     THREEZEROFIV            </IDS>
        <CCR>K21/2732/18B                   </CCR>
        <COF>K001    5:5:5:1      TH68006 28112010                </COF>
        <ADJ>INOT GUILTY   GUILTY        260920110000 </ADJ>
        <DIS>I4004    08102011                                                                                        </DIS>
      </ASI>
      <GMT>000010073ENQR000732R</GMT>
    </CXE01>`,
    expectedRequest: "",
    count: 1
  }
]
