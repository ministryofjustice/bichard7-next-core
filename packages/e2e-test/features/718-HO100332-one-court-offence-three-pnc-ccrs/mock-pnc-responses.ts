import { mockUpdate } from "../../utils/pncMocks"

export default () => [
  {
    matchRegex: "CXE01",
    response: `<?XML VERSION="1.0" STANDALONE="YES"?>
    <CXE01>
      <GMH>073ENQR000020SENQASIPNCA05A73000017300000120210316152773000001                                             050001772</GMH>
      <ASI>
        <FSC>K04CA</FSC>
        <IDS>K12/14X     AVALON                  </IDS>
        <CCR>K12/2732/15R                   </CCR>
        <COF>K001    1:9:7:1      OF61016 01062009                </COF>
        <CCR>K12/2732/16T                   </CCR>
        <COF>K001    1:9:7:1      OF61016 01062009                </COF>
        <CCR>K12/2732/17U                   </CCR>
        <COF>K001    1:9:7:1      OF61016 01062009                </COF>
      </ASI>
      <GMT>000008073ENQR004540S</GMT>
    </CXE01>`,
    expectedRequest: ""
  },
  mockUpdate("CXU02", {
    expectedRequest:
      "<FSC>K04YZ</FSC><IDS>K12/14X     AVALON                  </IDS><CCR>K12/2732/17U                   </CCR><COU>I2576                                                                       AVALON/MARTIN                                         011020090000</COU><CCH>K001              OF61016 </CCH><ADJ>INOT GUILTY   GUILTY        011020090000 </ADJ><DIS>I1002M11                   00                                                                            </DIS>"
  })
]
