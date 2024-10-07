import { mockUpdate } from "../../utils/pncMocks"

export default () => [
  {
    matchRegex: "CXE01",
    response: `<?xml version="1.0" standalone="yes"?>
    <CXE01>
      <GMH>073ENQR000335RENQASIPNCA05A73000017300000120210901140673000001                                             050002351</GMH>
      <ASI>
        <FSC>K01ZD</FSC>
        <IDS>K21/22T     ADDOFFSENNOP            </IDS>
        <CCR>K21/2732/17A                   </CCR>
        <COF>K001    5:5:5:1      TH68006 28112010                </COF>
        <COF>K002    5:7:11:10    TH68151 28112010                </COF>
      </ASI>
      <GMT>000009073ENQR000335R</GMT>
    </CXE01>`,
    expectedRequest: "",
    count: 1
  },
  mockUpdate("CXU02", {
    expectedRequest:
      "<FSC>K01YZ</FSC><IDS>K21/22T     ADDOFFSENNOP            </IDS><CCR>K21/2732/17A                   </CCR><COU>I2576                                                                       ADDOFFSENNOPNCADJ/NOEXCEPTION                         260920110000</COU><CCH>K001              TH68006 </CCH><ADJ>INOT GUILTY   GUILTY        260920110000 </ADJ><DIS>I4047    26102011          00                                                                            </DIS><CCH>K002              TH68151 </CCH><ADJ>INOT GUILTY   GUILTY        260920110000 </ADJ><DIS>I4047    26102011          00                                                                            </DIS>",
    count: 1
  }),
  mockUpdate("CXU01", {
    expectedRequest:
      "<FSC>K01YZ</FSC><IDS>K21/22T     ADDOFFSENNOP            </IDS><ASR>K12/01ZD/01/445748R                    </ASR><REM>I26092011B    2576                                                                       261020112576                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      0000                                                                                                                                                                              </REM>",
    count: 1
  }),
  {
    matchRegex: "CXE01",
    response: `<?xml version="1.0" standalone="yes"?>
    <CXE01>
      <GMH>073ENQR000336RENQASIPNCA05A73000017300000120210901140673000001                                             050002354</GMH>
      <ASI>
        <FSC>K01ZD</FSC>
        <IDS>K21/22T     ADDOFFSENNOP            </IDS>
        <CCR>K21/2732/17A                   </CCR>
        <COF>K001    5:5:5:1      TH68006 28112010                </COF>
        <ADJ>INOT GUILTY   GUILTY        260920110000 </ADJ>
        <DIS>I4047    26102011                                                                                        </DIS>
        <COF>K002    5:7:11:10    TH68151 28112010                </COF>
        <ADJ>INOT GUILTY   GUILTY        260920110000 </ADJ>
        <DIS>I4047    26102011                                                                                        </DIS>
      </ASI><GMT>000013073ENQR000336R</GMT>
    </CXE01>`,
    expectedRequest: "",
    count: 1
  },
  mockUpdate("CXU04", {
    expectedRequest:
      "<FSC>K01YZ</FSC><IDS>K21/22T     ADDOFFSENNOP            </IDS><SUB>I2576                                                                       26102011D</SUB><CCR>K21/2732/17A                   </CCR><CCH>K001              TH68006 </CCH><DIS>I1015            0000100.0000                                                                            </DIS><CCH>K002              TH68151 </CCH><DIS>I1015            0000200.0000                                                                            </DIS>",
    count: 1
  })
]
