import { mockUpdate } from "../../utils/pncMocks"

export default () => [
  {
    matchRegex: "CXE01",
    response: `<?xml version="1.0" standalone="yes"?>
    <CXE01>
      <GMH>073ENQR000049RENQASIPNCA05A73000017300000120210827105973000001                                             050001807</GMH>
      <ASI>
        <FSC>K01ZD</FSC>
        <IDS>K12/17A     CANBERRA                </IDS>
        <CCR>K12/2732/24B                   </CCR>
        <COF>K001    1:9:7:1      OF61016 01062009                </COF>
        <COF>K002    11:6:4:1     PC53001 01062009                </COF>
        <CCR>K12/2732/25C                   </CCR>
        <COF>K001    5:5:2:1      TH68001 01062009                </COF>
      </ASI>
      <GMT>000011073ENQR000049R</GMT>
    </CXE01>`,
    expectedRequest: "",
    count: 1
  },
  mockUpdate("CXU02", {
    expectedRequest:
      "<FSC>K01YZ</FSC><IDS>K12/17A     CANBERRA                </IDS><CCR>K12/2732/24B                   </CCR><COU>I2576                                                                       CANBERRA/MARTIN                                       101020090000</COU><CCH>K001              OF61016 </CCH><ADJ>INOT GUILTY   GUILTY        101020090000 </ADJ><DIS>I1002M12                   00                                                                            </DIS><CCH>K002              PC53001 </CCH><ADJ>INOT GUILTY   GUILTY        101020090000 </ADJ><DIS>I1002M13                   00                                                                            </DIS>",
    count: 1
  }),
  {
    matchRegex: "CXE01",
    response: `<?xml version="1.0" standalone="yes"?>
    <CXE01>
      <GMH>073ENQR000050RENQASIPNCA05A73000017300000120210827105973000001                                             050001808</GMH>
      <ASI>
        <FSC>K01ZD</FSC>
        <IDS>K12/17A     CANBERRA                </IDS>
        <CCR>K12/2732/24B                   </CCR>
        <COF>K001    1:9:7:1      OF61016 01062009                </COF>
        <ADJ>INOT GUILTY   GUILTY        101020090000 </ADJ>
        <DIS>I1002M12                                                                                                 </DIS>
        <COF>K002    11:6:4:1     PC53001 01062009                </COF>
        <ADJ>INOT GUILTY   GUILTY        101020090000 </ADJ>
        <DIS>I1002M13                                                                                                 </DIS>
        <CCR>K12/2732/25C                   </CCR>
        <COF>K001    5:5:2:1      TH68001 01062009                </COF>
      </ASI>
      <GMT>000015073ENQR000050R</GMT>
    </CXE01>`,
    expectedRequest: "",
    count: 1
  },
  mockUpdate("CXU02", {
    expectedRequest:
      "<FSC>K01YZ</FSC><IDS>K12/17A     CANBERRA                </IDS><CCR>K12/2732/25C                   </CCR><COU>I2576                                                                       CANBERRA/MARTIN                                       201020090000</COU><CCH>K001              TH68001 </CCH><ADJ>INOT GUILTY   GUILTY        201020090000 </ADJ><DIS>I4004    08112009          00                                                                            </DIS><ASR>K12/0000/00/9W                         </ASR><ACH>I                                                                                                                                            TH68151                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     NKINGSTON HIGH STREET                                                                                                                                                                                                                   01ZD02112006                </ACH><ADJ>INOT GUILTY   GUILTY        201020090000 </ADJ><DIS>I4004    08112009          00                                                                            </DIS><ACH>I                                                                                                                                            TH68145                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     NKINGSTON HIGH STREET                                                                                                                                                                                                                   01ZD02112006                </ACH><ADJ>INOT GUILTY   GUILTY        201020090000 </ADJ><DIS>I4004    08112009          00                                                                            </DIS>",
    count: 1
  }),
  mockUpdate("CXU01", {
    expectedRequest:
      "<FSC>K01YZ</FSC><IDS>K12/17A     CANBERRA                </IDS><ASR>K12/0000/00/9W                         </ASR><REM>I20102009B    2576                                                                       081120092576                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      0000                                                                                                                                                                              </REM>",
    count: 1
  })
]
