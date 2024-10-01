import { mockUpdate } from "../../utils/pncMocks"

export default () => [
  {
    matchRegex: "CXE01",
    response: `<?xml version="1.0" standalone="yes"?>
    <CXE01>
      <GMH>073ENQR000337RENQASIPNCA05A73000017300000120210901140773000001                                             050002356</GMH>
      <ASI>
        <FSC>K01ZD</FSC>
        <IDS>K21/23U     BREACHPLEANO            </IDS>
        <CCR>K21/2732/18B                   </CCR>
        <COF>K001    8:7:69:3     CJ03510 01102010                </COF>
      </ASI>
      <GMT>000008073ENQR000337R</GMT>
    </CXE01>`,
    expectedRequest: "",
    count: 1
  },
  mockUpdate("CXU01", {
    expectedRequest:
      "<FSC>K01YZ</FSC><IDS>K21/23U     BREACHPLEANO            </IDS><ASR>K13/01ZD/01/449640W                    </ASR><REM>I26102011B    2576                                                                       281020112576                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      0000                                                                                                                                                                              </REM>",
    count: 1
  }),
  {
    matchRegex: "CXE01",
    response: `<?xml version="1.0" standalone="yes"?>
    <CXE01>
      <GMH>073ENQR000338RENQASIPNCA05A73000017300000120210901140773000001                                             050002358</GMH>
      <ASI>
        <FSC>K01ZD</FSC>
        <IDS>K21/23U     BREACHPLEANO            </IDS>
        <CCR>K21/2732/18B                   </CCR>
        <COF>K001    8:7:69:3     CJ03510 01102010                </COF>
      </ASI>
      <GMT>000008073ENQR000338R</GMT>
    </CXE01>`,
    expectedRequest: "",
    count: 1
  },
  mockUpdate("CXU01", {
    expectedRequest:
      "<FSC>K01YZ</FSC><IDS>K21/23U     BREACHPLEANO            </IDS><ASR>K13/01ZD/01/449640W                    </ASR><REM>I28102011B    2576                                                                       281120112576                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      0000                                                                                                                                                                              </REM>",
    count: 1
  }),
  {
    matchRegex: "CXE01",
    response: `<?xml version="1.0" standalone="yes"?>
    <CXE01>
      <GMH>073ENQR000339RENQASIPNCA05A73000017300000120210901140773000001                                             050002360</GMH>
      <ASI>
        <FSC>K01ZD</FSC>
        <IDS>K21/23U     BREACHPLEANO            </IDS>
        <CCR>K21/2732/18B                   </CCR>
        <COF>K001    8:7:69:3     CJ03510 01102010                </COF>
      </ASI>
      <GMT>000008073ENQR000339R</GMT>
    </CXE01>`,
    expectedRequest: "",
    count: 1
  },
  mockUpdate("CXU02", {
    expectedRequest:
      "<FSC>K01YZ</FSC><IDS>K21/23U     BREACHPLEANO            </IDS><CCR>K21/2732/18B                   </CCR><COU>I2576                                                                       BREACHPLEANOVERDICT/STANDALONE                        281120110000</COU><CCH>K001              CJ03510 </CCH><ADJ>IGUILTY       GUILTY        281120110000 </ADJ><DIS>I1030                      00                                                                            </DIS>",
    count: 1
  })
]
