import { mockUpdate } from "../../utils/pncMocks"

export default () => [
  {
    matchRegex: "CXE01",
    response: `<?xml version="1.0" standalone="yes"?>
    <CXE01>
      <GMH>073ENQR000689RENQASIPNCA05A73000017300000120210903101373000001                                             050002864</GMH>
      <ASI>
        <FSC>K01ZD</FSC>
        <IDS>K21/2W      TENENBAUM               </IDS>
        <CCR>K21/2732/2J                    </CCR>
        <COF>K001    1:9:7:2      OF61018 28112010                </COF>
      </ASI>
      <GMT>000008073ENQR000689R</GMT>
    </CXE01>`,
    expectedRequest: "",
    count: 1
  },
  mockUpdate("CXU02", {
    expectedRequest:
      "<FSC>K01YZ</FSC><IDS>K21/2W      TENENBAUM               </IDS><CCR>K21/2732/2J                    </CCR><COU>I2576                                                                       TENENBAUM/CHAS                                        260920110000</COU><CCH>K001              OF61018 </CCH><ADJ>INOT GUILTY   GUILTY        260920110000 </ADJ><DIS>I4027    01102011          00                                                                            </DIS>",
    count: 1
  }),
  mockUpdate("CXU01", {
    expectedRequest:
      "<FSC>K01YZ</FSC><IDS>K21/2W      TENENBAUM               </IDS><ASR>K11/01ZD/01/410799E                    </ASR><REM>I26092011B    2576                                                                       011020112576                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      0000                                                                                                                                                                              </REM>",
    count: 1
  }),
  {
    matchRegex: "CXE01",
    response: `<?xml version="1.0" standalone="yes"?>
    <CXE01>
      <GMH>073ENQR000690RENQASIPNCA05A73000017300000120210903101373000001                                             050002867</GMH>
      <ASI>
        <FSC>K01ZD</FSC>
        <IDS>K21/2W      TENENBAUM               </IDS>
        <CCR>K21/2732/2J                    </CCR>
        <COF>K001    1:9:7:2      OF61018 28112010                </COF>
        <ADJ>INOT GUILTY   GUILTY        260920110000 </ADJ>
        <DIS>I4027    01102011                                                                                        </DIS>
      </ASI>
      <GMT>000010073ENQR000690R</GMT>
    </CXE01>`,
    expectedRequest: "",
    count: 1
  },
  mockUpdate("CXU01", {
    expectedRequest:
      "<FSC>K01YZ</FSC><IDS>K21/2W      TENENBAUM               </IDS><ASR>K11/01ZD/01/410799E                    </ASR><REM>I01102011B    2576                                                                       081020112576                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      0000                                                                                                                                                                              </REM>",
    count: 1
  }),
  {
    matchRegex: "CXE01",
    response: `<?xml version="1.0" standalone="yes"?>
    <CXE01>
      <GMH>073ENQR000691RENQASIPNCA05A73000017300000120210903101373000001                                             050002869</GMH>
      <ASI>
        <FSC>K01ZD</FSC>
        <IDS>K21/2W      TENENBAUM               </IDS>
        <CCR>K21/2732/2J                    </CCR>
        <COF>K001    1:9:7:2      OF61018 28112010                </COF>
        <ADJ>INOT GUILTY   GUILTY        260920110000 </ADJ>
        <DIS>I4027    01102011                                                                                        </DIS>
      </ASI>
      <GMT>000010073ENQR000691R</GMT>
    </CXE01>`,
    expectedRequest: "",
    count: 1
  },
  mockUpdate("CXU04", {
    expectedRequest:
      "<FSC>K01YZ</FSC><IDS>K21/2W      TENENBAUM               </IDS><SUB>I2576                                                                       08102011D</SUB><CCR>K21/2732/2J                    </CCR><CCH>K001              OF61018 </CCH><DIS>I1002M3                    00                                                                            </DIS>",
    count: 1
  })
]
