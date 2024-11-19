import { mockUpdate } from "../../utils/pncMocks"

export default () => [
  {
    matchRegex: "CXE01",
    response: `<?xml version="1.0" standalone="yes"?>
    <CXE01>
      <GMH>073ENQR000074RENQASIPNCA05A73000017300000120210827074173000001                                             050001861</GMH>
      <ASI>
        <FSC>K01VK</FSC>
        <IDS>K09/478F    NOLAN                   </IDS>
        <CCR>K09/0428/444E                  </CCR>
        <COF>K001    1:9:7:1      OF61016 01062009                </COF>
        <COF>K002    11:6:4:1     PC53001 01062009                </COF>
        <CCR>K09/0413/445H                  </CCR>
        <COF>K001    5:5:2:1      TH68001 01062009                </COF>
      </ASI>
      <GMT>000011073ENQR000074R</GMT>
    </CXE01>`,
    expectedRequest: "",
    count: 1
  },
  mockUpdate("CXU02", {
    expectedRequest:
      "<FSC>K01YZ</FSC><IDS>K09/478F    NOLAN                   </IDS><CCR>K09/0428/444E                  </CCR><COU>I2576                                                                       NOLAN/NIGEL                                           260920110000</COU><CRT>I2576                                                                       01122011</CRT><CCH>K001              OF61016 </CCH><ADJ>INOT GUILTY   NOT GUILTY    260920110000 </ADJ><DIS>I2006                      00                                                                            </DIS><CCH>K002              PC53001 </CCH><ADJ>INOT GUILTY                         0000 </ADJ><DIS>I2059                      00                                                                            </DIS>",
    count: 1
  }),
  mockUpdate("CXU02", {
    expectedRequest:
      "<FSC>K01YZ</FSC><IDS>K09/478F    NOLAN                   </IDS><CCR>K09/0413/445H                  </CCR><COU>I2576                                                                       NOLAN/NIGEL                                           260920110000</COU><CCH>K001              TH68001 </CCH><ADJ>INOT GUILTY   GUILTY        260920110000 </ADJ><DIS>I4011    01122011          00                                                                            </DIS>",
    count: 1
  }),
  mockUpdate("CXU01", {
    expectedRequest:
      "<FSC>K01YZ</FSC><IDS>K09/478F    NOLAN                   </IDS><ASR>K09/0000/00/20002F                     </ASR><REM>I26092011B    2576                                                                       011220112576                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      0000                                                                                                                                                                              </REM>",
    count: 1
  }),
  {
    matchRegex: "CXE01",
    response: `<?xml version="1.0" standalone="yes"?>
    <CXE01>
      <GMH>073ENQR000075RENQASIPNCA05A73000017300000120210827074373000001                                             050001865</GMH>
      <ASI>
        <FSC>K01VK</FSC>
        <IDS>K09/478F    NOLAN                   </IDS>
        <CCR>K09/0428/444E                  </CCR>
        <COF>K001    1:9:7:1      OF61016 01062009                </COF>
        <ADJ>INOT GUILTY   NOT GUILTY    260920110000 </ADJ>
        <DIS>I2006                                                                                                    </DIS>
        <CCR>K21/2732/1H                    </CCR>
        <COF>K001    11:6:4:1     PC53001 01062009                </COF>
        <CCR>K09/0413/445H                  </CCR>
        <COF>K001    5:5:2:1      TH68001 01062009                </COF>
        <ADJ>INOT GUILTY   GUILTY        260920110000 </ADJ>
        <DIS>I4011    01122011                                                                                        </DIS>
      </ASI>
      <GMT>000016073ENQR000075R</GMT>
    </CXE01>`,
    expectedRequest: "",
    count: 1
  },
  mockUpdate("CXU02", {
    expectedRequest:
      "<FSC>K01YZ</FSC><IDS>K09/478F    NOLAN                   </IDS><CCR>K21/2732/1H                    </CCR><COU>I2576                                                                       NOLAN/NIGEL                                           011220110000</COU><CCH>K001              PC53001 </CCH><ADJ>INOT GUILTY   GUILTY        011220110000 </ADJ><DIS>I1002M10                   00                                                                            </DIS>",
    count: 1
  }),
  mockUpdate("CXU04", {
    expectedRequest:
      "<FSC>K01YZ</FSC><IDS>K09/478F    NOLAN                   </IDS><SUB>I2576                                                                       01122011D</SUB><CCR>K09/0413/445H                  </CCR><CCH>K001              TH68001 </CCH><DIS>I1002M10                   00                                                                            </DIS>",
    count: 1
  })
]
