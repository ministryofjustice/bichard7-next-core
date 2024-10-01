import { mockUpdate } from "../../utils/pncMocks"

export default () => [
  {
    matchRegex: "CXE01",
    response: `<?xml version="1.0" standalone="yes"?>
    <CXE01>
      <GMH>073ENQR000053RENQASIPNCA05A73000017300000120210827114073000001                                             050001816</GMH>
      <ASI>
        <FSC>K01ZD</FSC>
        <IDS>K13/2Z      NOEXCEPTION             </IDS>
        <CCR>K13/2732/1U                    </CCR>
        <COF>K001    5:5:8:1      TH68010 01102010                </COF>
        <CCR>K13/2732/2V                    </CCR>
        <COF>K001    5:5:9:1      TH68012 01102010                </COF>
      </ASI>
      <GMT>000010073ENQR000053R</GMT>
    </CXE01>`,
    expectedRequest: "",
    count: 1
  },
  mockUpdate("CXU02", {
    expectedRequest:
      "<FSC>K01YZ</FSC><IDS>K13/2Z      NOEXCEPTION             </IDS><CCR>K13/2732/1U                    </CCR><COU>I2576                                                                       NOEXCEPTION/ADDEDOFFENCE                              261020110000</COU><CCH>K001              TH68010 </CCH><ADJ>INOT GUILTY   GUILTY        261020110000 </ADJ><DIS>I1002M3                    00                                                                            </DIS>",
    count: 1
  }),
  mockUpdate("CXU02", {
    expectedRequest:
      "<FSC>K01YZ</FSC><IDS>K13/2Z      NOEXCEPTION             </IDS><CCR>K13/2732/2V                    </CCR><COU>I2576                                                                       NOEXCEPTION/ADDEDOFFENCE                              261020110000</COU><CCH>K001              TH68012 </CCH><ADJ>INOT GUILTY   GUILTY        261020110000 </ADJ><DIS>I1002M4                    00                                                                            </DIS>",
    count: 1
  })
]
