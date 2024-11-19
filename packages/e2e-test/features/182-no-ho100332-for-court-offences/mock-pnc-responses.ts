import { mockUpdate } from "../../utils/pncMocks"

export default () => [
  {
    matchRegex: "CXE01",
    response: `<?xml version="1.0" standalone="yes"?>
    <CXE01>
      <GMH>073ENQR000142RENQASIPNCA05A73000017300000120210827110273000001                                             050002050</GMH>
      <ASI>
        <FSC>K01ZD</FSC>
        <IDS>K12/19C     MANCHESTER              </IDS>
        <CCR>K12/2732/28F                   </CCR>
        <COF>K001    1:9:7:1      OF61016 01062009                </COF>
        <COF>K002    11:6:4:1     PC53001 01062009                </COF>
        <CCR>K12/2732/29G                   </CCR>
        <COF>K001    5:5:2:1      TH68001 01062009                </COF>
      </ASI>
      <GMT>000011073ENQR000142R</GMT>
    </CXE01>`,
    expectedRequest: "",
    count: 1
  },
  mockUpdate("CXU02", {
    expectedRequest:
      "<FSC>K01YZ</FSC><IDS>K12/19C     MANCHESTER              </IDS><CCR>K12/2732/28F                   </CCR><COU>I2576                                                                       MANCHESTER/MARTIN                                     101020090000</COU><CCH>K001              OF61016 </CCH><ADJ>INOT GUILTY   GUILTY        101020090000 </ADJ><DIS>I1002M12                   00                                                                            </DIS><CCH>K002              PC53001 </CCH><ADJ>INOT GUILTY   GUILTY        101020090000 </ADJ><DIS>I1002M13                   00                                                                            </DIS>",
    count: 1
  }),
  mockUpdate("CXU02", {
    expectedRequest:
      "<FSC>K01YZ</FSC><IDS>K12/19C     MANCHESTER              </IDS><CCR>K12/2732/29G                   </CCR><COU>I2576                                                                       MANCHESTER/MARTIN                                     101020090000</COU><CCH>K001              TH68001 </CCH><ADJ>INOT GUILTY   GUILTY        101020090000 </ADJ><DIS>I1002M14                   00                                                                            </DIS>",
    count: 1
  })
]
