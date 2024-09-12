import { mockUpdate } from "../../utils/pncMocks"

export default () => [
  {
    matchRegex: "CXE01",
    response: `<?xml version="1.0" standalone="yes"?>
    <CXE01>
      <GMH>073ENQR000302RENQASIPNCA05A73000017300000120210901124473000001                                             050002281</GMH>
      <ASI>
        <FSC>K01ZD</FSC>
        <IDS>K21/4Y      JIMBOBJONES             </IDS>
        <CCR>K21/2732/4L                    </CCR>
        <COF>K001    12:15:16:1   RT88007 28112010                </COF>
      </ASI>
      <GMT>000008073ENQR000302R</GMT>
    </CXE01>`,
    expectedRequest: "",
    count: 1
  },
  mockUpdate("CXU02", {
    expectedRequest:
      "<FSC>K01YZ</FSC><IDS>K21/4Y      JIMBOBJONES             </IDS><CCR>K21/2732/4L                    </CCR><COU>I1910                                                                       JIMBOBJONES/BOBBY                                     260920110000</COU><CCH>K001              RT88007 </CCH><ADJ>INOT GUILTY   GUILTY        260920110000 </ADJ><DIS>I3096                      00                                                                            </DIS><DIS>I4047    26102011          00                                                                            </DIS>",
    count: 1
  }),
  mockUpdate("CXU01", {
    expectedRequest:
      "<FSC>K01YZ</FSC><IDS>K21/4Y      JIMBOBJONES             </IDS><ASR>K12/01ZD/01/448696W                    </ASR><REM>I26092011B    1910                                                                       261020112576                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      0000                                                                                                                                                                              </REM>",
    count: 1
  }),
  {
    matchRegex: "CXE01",
    response: `<?xml version="1.0" standalone="yes"?>
    <CXE01>
      <GMH>073ENQR000303RENQASIPNCA05A73000017300000120210901124573000001                                             050002284</GMH>
      <ASI>
        <FSC>K01ZD</FSC>
        <IDS>K21/4Y      JIMBOBJONES             </IDS>
        <CCR>K21/2732/4L                    </CCR>
        <COF>K001    12:15:16:1   RT88007 28112010                </COF>
        <ADJ>INOT GUILTY   GUILTY        260920110000 </ADJ>
        <DIS>I3096                                                                                                    </DIS>
        <DIS>I4047    26102011                                                                                        </DIS>
      </ASI>
      <GMT>000011073ENQR000303R</GMT>
    </CXE01>`,
    expectedRequest: "",
    count: 1
  },
  mockUpdate("CXU04", {
    expectedRequest:
      "<FSC>K01YZ</FSC><IDS>K21/4Y      JIMBOBJONES             </IDS><SUB>I1910                                                                       26102011D</SUB><CCR>K21/2732/4L                    </CCR><CCH>K001              RT88007 </CCH><DIS>I3050                      00                                                                            </DIS><DIS>I3070M12                   00            FROM 26/09/11                                                   </DIS>",
    count: 1
  })
]
