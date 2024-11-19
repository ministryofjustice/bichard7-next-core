import { mockUpdate } from "../../utils/pncMocks"

export default () => [
  {
    matchRegex: "CXE01",
    response: `<?xml version="1.0" standalone="yes"?>
    <CXE01>
      <GMH>073ENQR000343RENQASIPNCA05A73000017300000120210901141073000001                                             050002370</GMH>
      <ASI>
        <FSC>K01ZD</FSC>
        <IDS>K21/25W     CIVILCASE               </IDS>
        <CCR>K21/2732/20D                   </CCR>
        <COF>K001    5:5:8:1      TH68010 26092011                </COF>
        </ASI>
      <GMT>000008073ENQR000343R</GMT>
    </CXE01>`,
    expectedRequest: "",
    count: 1
  },
  mockUpdate("CXU02", {
    expectedRequest:
      "<FSC>K01YZ</FSC><IDS>K21/25W     CIVILCASE               </IDS><CCR>K21/2732/20D                   </CCR><COU>I2576                                                                       CIVILCASE/ADDEDATSENTENCE                             260920110000</COU><CCH>K001              TH68010 </CCH><ADJ>IGUILTY       GUILTY        260920110000 </ADJ><DIS>I4011    26102011          00                                                                            </DIS>",
    count: 1
  }),
  mockUpdate("CXU01", {
    expectedRequest:
      "<FSC>K01YZ</FSC><IDS>K21/25W     CIVILCASE               </IDS><ASR>K13/01ZD/01/449618X                    </ASR><REM>I26092011A    2576                                                                       261020112576                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      0000                                                                                                                                                                              </REM>",
    count: 1
  }),
  {
    matchRegex: "CXE01",
    response: `<?xml version="1.0" standalone="yes"?>
    <CXE01>
      <GMH>073ENQR000344RENQASIPNCA05A73000017300000120210901141073000001                                             050002373</GMH>
      <ASI>
        <FSC>K01ZD</FSC>
        <IDS>K21/25W     CIVILCASE               </IDS>
        <CCR>K21/2732/20D                   </CCR>
        <COF>K001    5:5:8:1      TH68010 26092011                </COF>
        <ADJ>IGUILTY       GUILTY        260920110000 </ADJ>
        <DIS>I4011    26102011                                                                                        </DIS>
      </ASI>
      <GMT>000010073ENQR000344R</GMT>
    </CXE01>`,
    expectedRequest: "",
    count: 1
  },
  mockUpdate("CXU04", {
    expectedRequest:
      "<FSC>K01YZ</FSC><IDS>K21/25W     CIVILCASE               </IDS><SUB>I2576                                                                       26102011D</SUB><CCR>K21/2732/20D                   </CCR><CCH>K001              TH68010 </CCH><DIS>I1002W16                   00                                                                            </DIS>",
    count: 1
  })
]
