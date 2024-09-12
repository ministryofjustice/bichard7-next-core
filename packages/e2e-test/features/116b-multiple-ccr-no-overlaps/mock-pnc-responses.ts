import { mockUpdate } from "../../utils/pncMocks"

export default () => [
  {
    matchRegex: "CXE01",
    response: `<?xml version="1.0" standalone="yes"?>
    <CXE01>
      <GMH>073ENQR000134RENQASIPNCA05A73000017300000120210831090973000001                                             050001952</GMH>
      <ASI>
        <FSC>K01VK</FSC>
        <IDS>K09/478F    NOLAN                   </IDS>
        <CCR>K09/0428/444E                  </CCR>
        <COF>K001    1:9:7:1      OF61016 01062009                </COF>
        <COF>K002    11:6:4:1     PC53001 01062009                </COF>
        <CCR>K09/0413/445H                  </CCR>
        <COF>K001    5:5:2:1      TH68001 01062009                </COF>
      </ASI>
      <GMT>000011073ENQR000134R</GMT>
      </CXE01>`,
    expectedRequest: "",
    count: 1
  },
  mockUpdate("CXU02", {
    expectedRequest:
      "<FSC>K01YZ</FSC><IDS>K09/478F    NOLAN                   </IDS><CCR>K09/0428/444E                  </CCR><COU>I2576                                                                       NOLAN/NIGEL                                           011020090000</COU><CRT>I2576                                                                       01112009</CRT><CCH>K001              OF61016 </CCH><ADJ>INOT GUILTY   NOT GUILTY    011020090000 </ADJ><DIS>I2006                      00                                                                            </DIS><CCH>K002              PC53001 </CCH><ADJ>INOT GUILTY                         0000 </ADJ><DIS>I2059                      00                                                                            </DIS>",
    count: 1
  }),
  mockUpdate("CXU02", {
    expectedRequest:
      "<FSC>K01YZ</FSC><IDS>K09/478F    NOLAN                   </IDS><CCR>K09/0413/445H                  </CCR><COU>I2576                                                                       NOLAN/NIGEL                                           011020090000</COU><CCH>K001              TH68001 </CCH><ADJ>INOT GUILTY   GUILTY        011020090000 </ADJ><DIS>I4011    01112009          00                                                                            </DIS>",
    count: 1
  }),
  mockUpdate("CXU01", {
    expectedRequest:
      "<FSC>K01YZ</FSC><IDS>K09/478F    NOLAN                   </IDS><ASR>K09/0000/00/20002F                     </ASR><REM>I01102009B    2576                                                                       011120092576                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      0000                                                                                                                                                                              </REM>",
    count: 1
  }),
  {
    matchRegex: "CXE01",
    response: `<?xml version="1.0" standalone="yes"?>
    <CXE01>
      <GMH>073ENQR000135RENQASIPNCA05A73000017300000120210831090973000001                                             050001956</GMH>
      <ASI>
        <FSC>K01VK</FSC>
        <IDS>K09/478F    NOLAN                   </IDS>
        <CCR>K09/0428/444E                  </CCR>
        <COF>K001    1:9:7:1      OF61016 01062009                </COF>
        <ADJ>INOT GUILTY   NOT GUILTY    011020090000 </ADJ>
        <DIS>I2006                                                                                                    </DIS>
        <CCR>K21/2732/1H                    </CCR>
        <COF>K001    11:6:4:1     PC53001 01062009                </COF>
        <CCR>K09/0413/445H                  </CCR>
        <COF>K001    5:5:2:1      TH68001 01062009                </COF>
        <ADJ>INOT GUILTY   GUILTY        011020090000 </ADJ>
        <DIS>I4011    01112009                                                                                        </DIS>
      </ASI>
      <GMT>000016073ENQR000135R</GMT>
    </CXE01>`,
    expectedRequest: "",
    count: 1
  },
  mockUpdate("CXU02", {
    expectedRequest:
      "<FSC>K01YZ</FSC><IDS>K09/478F    NOLAN                   </IDS><CCR>K21/2732/1H                    </CCR><COU>I2576                                                                       NOLAN/NIGEL                                           011120090000</COU><CCH>K001              PC53001 </CCH><ADJ>INOT GUILTY   GUILTY        011120090000 </ADJ><DIS>I1002M9                    00                                                                            </DIS>",
    count: 1
  }),
  mockUpdate("CXU04", {
    expectedRequest:
      "<FSC>K01YZ</FSC><IDS>K09/478F    NOLAN                   </IDS><SUB>I2576                                                                       01112009D</SUB><CCR>K09/0413/445H                  </CCR><CCH>K001              TH68001 </CCH><DIS>I1002M10                   00                                                                            </DIS>",
    count: 1
  })
]
