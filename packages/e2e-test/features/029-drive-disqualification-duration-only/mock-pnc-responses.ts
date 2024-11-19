import { mockUpdate } from "../../utils/pncMocks"

export default () => [
  {
    matchRegex: "CXE01",
    response: `<?xml version="1.0" standalone="yes"?>
    <CXE01>
      <GMH>073ENQR000304RENQASIPNCA05A73000017300000120210901124773000001                                             050002286</GMH>
      <ASI>
        <FSC>K01ZD</FSC>
        <IDS>K21/5Z      DUFFY                   </IDS>
        <CCR>K21/2732/5M                    </CCR>
        <COF>K001    12:15:16:1   RT88007 28112010                </COF>
      </ASI>
      <GMT>000008073ENQR000304R</GMT>
    </CXE01>`,
    expectedRequest: "",
    count: 1
  },
  mockUpdate("CXU02", {
    expectedRequest:
      "<FSC>K01YZ</FSC><IDS>K21/5Z      DUFFY                   </IDS><CCR>K21/2732/5M                    </CCR><COU>I1910                                                                       DUFFY/PATRICK                                         260920110000</COU><CCH>K001              RT88007 </CCH><ADJ>INOT GUILTY   GUILTY        260920110000 </ADJ><DIS>I3096                      00                                                                            </DIS><DIS>I4047    26102011          00                                                                            </DIS>",
    count: 1
  }),
  mockUpdate("CXU01", {
    expectedRequest:
      "<FSC>K01YZ</FSC><IDS>K21/5Z      DUFFY                   </IDS><ASR>K12/01ZD/01/448697X                    </ASR><REM>I26092011B    1910                                                                       261020112576                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      0000                                                                                                                                                                              </REM>",
    count: 1
  }),
  {
    matchRegex: "CXE01",
    response: `<?xml version="1.0" standalone="yes"?>
    <CXE01>
      <GMH>073ENQR000305RENQASIPNCA05A73000017300000120210901124773000001                                             050002289</GMH>
      <ASI>
        <FSC>K01ZD</FSC>
        <IDS>K21/5Z      DUFFY                   </IDS>
        <CCR>K21/2732/5M                    </CCR>
        <COF>K001    12:15:16:1   RT88007 28112010                </COF>
        <ADJ>INOT GUILTY   GUILTY        260920110000 </ADJ>
        <DIS>I3096                                                                                                    </DIS>
        <DIS>I4047    26102011                                                                                        </DIS>
      </ASI>
      <GMT>000011073ENQR000305R</GMT>
    </CXE01>`,
    expectedRequest: "",
    count: 1
  },
  mockUpdate("CXU04", {
    expectedRequest:
      "<FSC>K01YZ</FSC><IDS>K21/5Z      DUFFY                   </IDS><SUB>I1910                                                                       26102011D</SUB><CCR>K21/2732/5M                    </CCR><CCH>K001              RT88007 </CCH><DIS>I3050                      00                                                                            </DIS><DIS>I3071M18                   00                                                                            </DIS>",
    count: 1
  })
]
