import { mockUpdate } from "../../utils/pncMocks"

export default () => [
  {
    matchRegex: "CXE01",
    response: `<?xml version="1.0" standalone="yes"?>
    <CXE01>
      <GMH>073ENQR000136RENQASIPNCA05A73000017300000120210831091373000001                                             050001959</GMH>
      <ASI>
        <FSC>K01ZD</FSC>
        <IDS>K12/16Z     LANCASTER               </IDS>
        <CCR>K12/2732/22Z                   </CCR>
        <COF>K001    11:6:4:1     PC53001 01062009                </COF>
        <COF>K002    1:9:7:1      OF61016 01062009                </COF>
        <CCR>K12/2732/23A                   </CCR>
        <COF>K001    5:5:2:1      TH68001 01062009                </COF>
      </ASI>
      <GMT>000011073ENQR000136R</GMT>
    </CXE01>`,
    expectedRequest: "",
    count: 1
  },
  mockUpdate("CXU02", {
    expectedRequest:
      "<FSC>K01YZ</FSC><IDS>K12/16Z     LANCASTER               </IDS><CCR>K12/2732/22Z                   </CCR><COU>I2576                                                                       LANCASTER/MARTIN                                      101020090000</COU><CCH>K002              OF61016 </CCH><ADJ>INOT GUILTY   GUILTY        101020090000 </ADJ><DIS>I1002M12                   00                                                                            </DIS><CCH>K001              PC53001 </CCH><ADJ>INOT GUILTY   GUILTY        101020090000 </ADJ><DIS>I1002M13                   00                                                                            </DIS>",
    count: 1
  }),
  {
    matchRegex: "CXE01",
    response: `<?xml version="1.0" standalone="yes"?>
    <CXE01>
      <GMH>073ENQR000137RENQASIPNCA05A73000017300000120210831091473000001                                             050001961</GMH>
      <ASI>
        <FSC>K01ZD</FSC>
        <IDS>K12/16Z     LANCASTER               </IDS>
        <CCR>K12/2732/22Z                   </CCR>
        <COF>K001    11:6:4:1     PC53001 01062009                </COF>
        <ADJ>INOT GUILTY   GUILTY        101020090000 </ADJ>
        <DIS>I1002M13                                                                                                 </DIS>
        <COF>K002    1:9:7:1      OF61016 01062009                </COF>
        <ADJ>INOT GUILTY   GUILTY        101020090000 </ADJ>
        <DIS>I1002M12                                                                                                 </DIS>
        <CCR>K12/2732/23A                   </CCR>
        <COF>K001    5:5:2:1      TH68001 01062009                </COF>
      </ASI>
      <GMT>000015073ENQR000137R</GMT>
    </CXE01>`,
    expectedRequest: "",
    count: 1
  },
  mockUpdate("CXU02", {
    expectedRequest:
      "<FSC>K01YZ</FSC><IDS>K12/16Z     LANCASTER               </IDS><CCR>K12/2732/23A                   </CCR><COU>I2576                                                                       LANCASTER/MARTIN                                      201020090000</COU><CCH>K001              TH68001 </CCH><ADJ>INOT GUILTY   GUILTY        201020090000 </ADJ><DIS>I1002M14                   00                                                                            </DIS><ASR>K12/0000/00/8V                         </ASR><ACH>I                                                                                                                                            TH68151                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     NKINGSTON HIGH STREET                                                                                                                                                                                                                   01ZD02112006                </ACH><ADJ>INOT GUILTY   GUILTY        201020090000 </ADJ><DIS>I1002M14                   00                                                                            </DIS>",
    count: 1
  })
]
