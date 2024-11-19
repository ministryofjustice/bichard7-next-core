import { mockUpdate } from "../../utils/pncMocks"

export default () => [
  {
    matchRegex: "CXE01",
    response: `<?xml version="1.0" standalone="yes"?>
    <CXE01>
      <GMH>073ENQR000340RENQASIPNCA05A73000017300000120210901140973000001                                             050002362</GMH>
      <ASI>
        <FSC>K01ZD</FSC>
        <IDS>K21/24V     BREACHPLEANO            </IDS>
        <CCR>K21/2732/19C                   </CCR>
        <COF>K001    8:7:69:3     CJ03510 01102010                </COF>
        <COF>K002    5:5:5:1      TH68006 01102010                </COF>
      </ASI>
      <GMT>000009073ENQR000340R</GMT>
    </CXE01>`,
    expectedRequest: "",
    count: 1
  },
  mockUpdate("CXU02", {
    expectedRequest:
      "<FSC>K01YZ</FSC><IDS>K21/24V     BREACHPLEANO            </IDS><CCR>K21/2732/19C                   </CCR><COU>I2576                                                                       BREACHPLEANOVERDICT/OTHEROFFENCES                     261020110000</COU><CRT>I2576                                                                       28102011</CRT><CCH>K001              CJ03510 </CCH><ADJ>IGUILTY                             0000 </ADJ><DIS>I2059                      00                                                                            </DIS><CCH>K002              TH68006 </CCH><ADJ>INOT GUILTY   GUILTY        261020110000 </ADJ><DIS>I4027    28102011          00                                                                            </DIS>",
    count: 1
  }),
  mockUpdate("CXU01", {
    expectedRequest:
      "<FSC>K01YZ</FSC><IDS>K21/24V     BREACHPLEANO            </IDS><ASR>K13/01ZD/01/449641X                    </ASR><REM>I26102011B    2576                                                                       281020112576                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      0000                                                                                                                                                                              </REM>",
    count: 1
  }),
  {
    matchRegex: "CXE01",
    response: `<?xml version="1.0" standalone="yes"?>
    <CXE01>
      <GMH>073ENQR000341RENQASIPNCA05A73000017300000120210901140973000001                                             050002365</GMH>
      <ASI>
        <FSC>K01ZD</FSC>
        <IDS>K21/24V     BREACHPLEANO            </IDS>
        <CCR>K21/2732/27L                   </CCR>
        <COF>K001    8:7:69:3     CJ03510 01102010                </COF>
        <CCR>K21/2732/19C                   </CCR>
        <COF>K001    5:5:5:1      TH68006 01102010                </COF>
        <ADJ>INOT GUILTY   GUILTY        261020110000 </ADJ>
        <DIS>I4027    28102011                                                                                        </DIS>
      </ASI>
      <GMT>000012073ENQR000341R</GMT>
    </CXE01>`,
    expectedRequest: "",
    count: 1
  },
  mockUpdate("CXU01", {
    expectedRequest:
      "<FSC>K01YZ</FSC><IDS>K21/24V     BREACHPLEANO            </IDS><ASR>K13/01ZD/01/449641X                    </ASR><REM>I28102011B    2576                                                                       281120112576                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      0000                                                                                                                                                                              </REM>",
    count: 1
  }),
  {
    matchRegex: "CXE01",
    response: `<?xml version="1.0" standalone="yes"?>
    <CXE01>
      <GMH>073ENQR000342RENQASIPNCA05A73000017300000120210901140973000001                                             050002367</GMH>
      <ASI>
        <FSC>K01ZD</FSC>
        <IDS>K21/24V     BREACHPLEANO            </IDS>
        <CCR>K21/2732/27L                   </CCR>
        <COF>K001    8:7:69:3     CJ03510 01102010                </COF>
        <CCR>K21/2732/19C                   </CCR>
        <COF>K001    5:5:5:1      TH68006 01102010                </COF>
        <ADJ>INOT GUILTY   GUILTY        261020110000 </ADJ>
        <DIS>I4027    28102011                                                                                        </DIS>
      </ASI><GMT>000012073ENQR000342R</GMT>
    </CXE01>`,
    expectedRequest: "",
    count: 1
  },
  mockUpdate("CXU02", {
    expectedRequest:
      "<FSC>K01YZ</FSC><IDS>K21/24V     BREACHPLEANO            </IDS><CCR>K21/2732/27L                   </CCR><COU>I2576                                                                       BREACHPLEANOVERDICT/OTHEROFFENCES                     281120110000</COU><CCH>K001              CJ03510 </CCH><ADJ>IGUILTY       GUILTY        281120110000 </ADJ><DIS>I1030                      00                                                                            </DIS>",
    count: 1
  }),
  mockUpdate("CXU04", {
    expectedRequest:
      "<FSC>K01YZ</FSC><IDS>K21/24V     BREACHPLEANO            </IDS><SUB>I2576                                                                       28112011D</SUB><CCR>K21/2732/19C                   </CCR><CCH>K001              TH68006 </CCH><DIS>I1015            0000200.0000                                                                            </DIS>",
    count: 1
  })
]
