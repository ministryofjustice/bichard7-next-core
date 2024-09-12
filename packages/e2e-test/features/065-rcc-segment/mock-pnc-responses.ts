import { mockUpdate } from "../../utils/pncMocks"

export default () => [
  {
    matchRegex: "CXE01",
    response: `<?xml version="1.0" standalone="yes"?>
      <CXE01>
      <GMH>073ENQR000005RENQASIPNCA05A73000017300000120210920111073000001                                             050001759</GMH>
      <ASI>
        <FSC>K01ZD</FSC>
        <IDS>K21/1V      INNOCUOUS               </IDS>
        <CCR>K21/2732/1H                    </CCR>
        <COF>K001    5:5:5:1      TH68006 28112010                </COF>
      </ASI>
      <GMT>000008073ENQR000005R</GMT>
    </CXE01>`,
    expectedRequest: ""
  },
  mockUpdate("CXU02", {
    expectedRequest:
      "<FSC>K01YZ</FSC><IDS>K21/1V      INNOCUOUS               </IDS><CCR>K21/2732/1H                    </CCR><COU>I2576                                                                       INNOCUOUS/MISTER                                      260920110000</COU><RCC>I01ZD/5100008                                                                       </RCC><CCH>K001              TH68006 </CCH><ADJ>I                                   0000 </ADJ><DIS>I2060                      00                                                                            </DIS><ASR>K11/01ZD/01/410826J                    </ASR><ACH>I                                                                                                                                            TH68072                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     NKINGSTON HIGH STREET                                                                                                                                                                                                                   01ZD28112010                </ACH><ADJ>IGUILTY       GUILTY        260920110000 </ADJ><DIS>I1015            0000200.0000                                                                            </DIS>"
  })
]
