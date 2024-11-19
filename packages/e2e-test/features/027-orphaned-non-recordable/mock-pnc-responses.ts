import { mockUpdate } from "../../utils/pncMocks"

export default () => [
  {
    matchRegex: "CXE01",
    response: `<?xml version="1.0" standalone="yes"?>
    <CXE01>
      <GMH>073ENQR000300RENQASIPNCA05A73000017300000120210901124073000001                                             050002276</GMH>
      <ASI>
        <FSC>K01ZD</FSC>
        <IDS>K21/3X      HOMER                   </IDS>
        <CCR>K21/2732/3K                    </CCR>
        <COF>K001    5:5:5:1      TH68006 28112010                </COF>
        <COF>K002    12:15:13:1   RT88191 28112010                </COF>
      </ASI>
      <GMT>000009073ENQR000300R</GMT>
    </CXE01>`,
    expectedRequest: "",
    count: 1
  },
  mockUpdate("CXU02", {
    expectedRequest:
      "<FSC>K01YZ</FSC><IDS>K21/3X      HOMER                   </IDS><CCR>K21/2732/3K                    </CCR><COU>I2576                                                                       WELLS/HOMER                                           260920110000</COU><CRT>I2576                                                                       08102011</CRT><CCH>K001              TH68006 </CCH><ADJ>INOT GUILTY   NOT GUILTY    260920110000 </ADJ><DIS>I2051                      00                                                                            </DIS><CCH>K002              RT88191 </CCH><ADJ>INOT GUILTY                         0000 </ADJ><DIS>I2059                      00                                                                            </DIS>",
    count: 1
  }),
  mockUpdate("CXU01", {
    expectedRequest:
      "<FSC>K01YZ</FSC><IDS>K21/3X      HOMER                   </IDS><ASR>K11/01ZD/01/410785P                    </ASR><REM>I26092011B    2576                                                                       081020112576                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      0000                                                                                                                                                                              </REM>",
    count: 1
  }),
  {
    matchRegex: "CXE01",
    response: `<?xml version="1.0" standalone="yes"?>
    <CXE01>
      <GMH>073ENQR000301RENQASIPNCA05A73000017300000120210901124073000001                                             050002279</GMH>
      <ASI>
        <FSC>K01ZD</FSC>
        <IDS>K21/3X      HOMER                   </IDS>
        <CCR>K21/2732/3K                    </CCR>
        <COF>K001    5:5:5:1      TH68006 28112010                </COF>
        <ADJ>INOT GUILTY   NOT GUILTY    260920110000 </ADJ>
        <DIS>I2051                                                                                                    </DIS>
        <CCR>K21/2732/25J                   </CCR>
        <COF>K001    12:15:13:1   RT88191 28112010                </COF>
      </ASI>
      <GMT>000012073ENQR000301R</GMT>
    </CXE01>`,
    expectedRequest: "",
    count: 1
  },
  mockUpdate("CXU02", {
    expectedRequest:
      "<FSC>K01YZ</FSC><IDS>K21/3X      HOMER                   </IDS><CCR>K21/2732/25J                   </CCR><COU>I2576                                                                       WELLS/HOMER                                           081020110000</COU><CCH>K001              RT88191 </CCH><ADJ>INOT GUILTY   GUILTY        081020110000 </ADJ><DIS>I1015            0000100.0000                                                                            </DIS>",
    count: 1
  })
]
