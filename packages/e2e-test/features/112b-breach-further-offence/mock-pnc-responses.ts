import { mockUpdate } from "../../utils/pncMocks"

export default () => [
  {
    matchRegex: "CXE01",
    response: `<?xml version="1.0" standalone="yes"?>
    <CXE01>
      <GMH>073ENQR000698RENQASIPNCA05A73000017300000120210903102173000001                                             050002885</GMH>
      <ASI>
        <FSC>K01ZD</FSC>
        <IDS>K21/29A     SUSSENTENCE             </IDS>
        <CCR>K21/2732/23G                   </CCR>
        <COF>K001    5:5:8:1      TH68010 01102010                </COF>
      </ASI>
      <GMT>000008073ENQR000698R</GMT>
    </CXE01>`,
    expectedRequest: "",
    count: 1
  },
  mockUpdate("CXU02", {
    expectedRequest:
      "<FSC>K01YZ</FSC><IDS>K21/29A     SUSSENTENCE             </IDS><CCR>K21/2732/23G                   </CCR><COU>I2576                                                                       SUSSENTENCETWO/BREACH                                 261020110000</COU><CCH>K001              TH68010 </CCH><ADJ>INOT GUILTY   GUILTY        261020110000 </ADJ><DIS>I1002M3                    00                                                                            </DIS>",
    count: 1
  })
]
