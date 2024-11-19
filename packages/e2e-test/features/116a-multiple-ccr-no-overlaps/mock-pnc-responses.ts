import { mockUpdate } from "../../utils/pncMocks"

export default () => [
  {
    matchRegex: "CXE01",
    response: `<?xml version="1.0" standalone="yes"?>
    <CXE01>
      <GMH>073ENQR000132RENQASIPNCA05A73000017300000120210831090973000001                                             050001947</GMH>
      <ASI>
        <FSC>K01VK</FSC>
        <IDS>K09/477E    MILES                   </IDS>
        <CCR>K09/0428/442C                  </CCR>
        <COF>K001    5:1:1:1      TH68023 01062009                </COF>
        <CCR>K09/0413/443F                  </CCR>
        <COF>K001    11:1:5:1     FI68068 01062009                </COF>
      </ASI>
      <GMT>000010073ENQR000132R</GMT>
    </CXE01>`,
    expectedRequest: "",
    count: 1
  },
  mockUpdate("CXU02", {
    expectedRequest:
      "<FSC>K01YZ</FSC><IDS>K09/477E    MILES                   </IDS><CCR>K09/0428/442C                  </CCR><COU>I2576                                                                       MILES/WILLIAM                                         011020090000</COU><CCH>K001              TH68023 </CCH><ADJ>INOT GUILTY   NOT GUILTY    011020090000 </ADJ><DIS>I2006                      00                                                                            </DIS>",
    count: 1
  }),
  mockUpdate("CXU01", {
    expectedRequest:
      "<FSC>K01YZ</FSC><IDS>K09/477E    MILES                   </IDS><ASR>K09/0000/00/20001E                     </ASR><REM>I01102009B    2576                                                                       011120092576                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      0000                                                                                                                                                                              </REM>",
    count: 1
  }),
  {
    matchRegex: "CXE01",
    response: `<?xml version="1.0" standalone="yes"?>
    <CXE01>
      <GMH>073ENQR000133RENQASIPNCA05A73000017300000120210831090973000001                                             050001950</GMH>
      <ASI>
        <FSC>K01VK</FSC>
        <IDS>K09/477E    MILES                   </IDS>
        <CCR>K09/0428/442C                  </CCR>
        <COF>K001    5:1:1:1      TH68023 01062009                </COF>
        <ADJ>INOT GUILTY   NOT GUILTY    011020090000 </ADJ>
        <DIS>I2006                                                                                                    </DIS>
        <CCR>K09/0413/443F                  </CCR>
        <COF>K001    11:1:5:1     FI68068 01062009                </COF>
      </ASI>
      <GMT>000012073ENQR000133R</GMT>
    </CXE01>`,
    expectedRequest: "",
    count: 1
  },
  mockUpdate("CXU02", {
    expectedRequest:
      "<FSC>K01YZ</FSC><IDS>K09/477E    MILES                   </IDS><CCR>K09/0413/443F                  </CCR><COU>I2576                                                                       MILES/WILLIAM                                         011120090000</COU><CCH>K001              FI68068 </CCH><ADJ>INOT GUILTY   GUILTY        011120090000 </ADJ><DIS>I1002M10                   00                                                                            </DIS>",
    count: 1
  })
]
