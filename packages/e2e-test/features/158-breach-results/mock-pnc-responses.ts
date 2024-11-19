import { mockUpdate } from "../../utils/pncMocks"

export default () => [
  {
    matchRegex: "CXE01",
    response: `<?xml version="1.0" standalone="yes"?>
    <CXE01>
      <GMH>073ENQR000320RENQASIPNCA05A73000017300000120210901130373000001                                             050002317</GMH>
      <ASI>
        <FSC>K01ZD</FSC>
        <IDS>K21/13H     DDDRAVEN                </IDS>
        <CCR>K21/2732/10T                   </CCR>
        <COF>K001    8:7:69:3     CJ03510 01102010                </COF>
        <COF>K002    8:7:69:3     CJ03510 01102010                </COF>
      </ASI>
      <GMT>000009073ENQR000320R</GMT>
    </CXE01>`,
    expectedRequest: "",
    count: 1
  },
  mockUpdate("CXU02", {
    expectedRequest:
      "<FSC>K01YZ</FSC><IDS>K21/13H     DDDRAVEN                </IDS><CCR>K21/2732/10T                   </CCR><COU>I2576                                                                       DDDRAVEN/ALEX                                         211020110000</COU><CCH>K001              CJ03510 </CCH><ADJ>INO PLEA TAKENGUILTY        211020110000 </ADJ><DIS>I4011    28102011          00                                                                            </DIS><CCH>K002              CJ03510 </CCH><ADJ>INO PLEA TAKENGUILTY        211020110000 </ADJ><DIS>I4011    28102011          00                                                                            </DIS>",
    count: 1
  }),
  mockUpdate("CXU01", {
    expectedRequest:
      "<FSC>K01YZ</FSC><IDS>K21/13H     DDDRAVEN                </IDS><ASR>K11/01ZD/01/410821D                    </ASR><REM>I21102011B    2576                                                                       281020112576                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      0000                                                                                                                                                                              </REM>",
    count: 1
  }),
  {
    matchRegex: "CXE01",
    response: `<?xml version="1.0" standalone="yes"?>
    <CXE01>
      <GMH>073ENQR000321RENQASIPNCA05A73000017300000120210901130373000001                                             050002320</GMH>
      <ASI>
        <FSC>K01ZD</FSC>
        <IDS>K21/13H     DDDRAVEN                </IDS>
        <CCR>K21/2732/10T                   </CCR>
        <COF>K001    8:7:69:3     CJ03510 01102010                </COF>
        <ADJ>INO PLEA TAKENGUILTY        211020110000 </ADJ>
        <DIS>I4011    28102011                                                                                        </DIS>
        <COF>K002    8:7:69:3     CJ03510 01102010                </COF>
        <ADJ>INO PLEA TAKENGUILTY        211020110000 </ADJ>
        <DIS>I4011    28102011                                                                                        </DIS>
      </ASI>
      <GMT>000013073ENQR000321R</GMT>
    </CXE01>`,
    expectedRequest: ""
  }
]
