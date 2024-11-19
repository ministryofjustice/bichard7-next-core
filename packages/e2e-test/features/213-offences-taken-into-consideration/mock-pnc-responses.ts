import { mockUpdate } from "../../utils/pncMocks"

export default () => [
  {
    matchRegex: "CXE01",
    response: `<?xml version="1.0" standalone="yes"?>
    <CXE01>
      <GMH>073ENQR000330RENQASIPNCA05A73000017300000120210901131673000001                                             050002340</GMH>
      <ASI>
        <FSC>K01ZD</FSC>
        <IDS>K21/20Q     SENDEF                  </IDS>
        <CCR>K21/2732/15Y                   </CCR>
        <COF>K001    5:5:5:1      TH68006 01102011                </COF>
      </ASI>
      <GMT>000008073ENQR000330R</GMT>
    </CXE01>`,
    expectedRequest: "",
    count: 1
  },
  mockUpdate("CXU02", {
    expectedRequest:
      "<FSC>K01YZ</FSC><IDS>K21/20Q     SENDEF                  </IDS><CCR>K21/2732/15Y                   </CCR><COU>I2576                                                                       SENDEF/TICS                                           261020110000</COU><CCH>K001              TH68006 </CCH><ADJ>IGUILTY       GUILTY        261020110000 </ADJ><DIS>I4047    30102011          00                                                                            </DIS>",
    count: 1
  }),
  mockUpdate("CXU01", {
    expectedRequest:
      "<FSC>K01YZ</FSC><IDS>K21/20Q     SENDEF                  </IDS><ASR>K11/01ZD/01/440811B                    </ASR><REM>I26102011B    2576                                                                       301020112576                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      0000                                                                                                                                                                              </REM>",
    count: 1
  }),
  {
    matchRegex: "CXE01",
    response: `<?xml version="1.0" standalone="yes"?>
    <CXE01>
      <GMH>073ENQR000331RENQASIPNCA05A73000017300000120210901131673000001                                             050002343</GMH>
      <ASI>
        <FSC>K01ZD</FSC>
        <IDS>K21/20Q     SENDEF                  </IDS>
        <CCR>K21/2732/15Y                   </CCR>
        <COF>K001    5:5:5:1      TH68006 01102011                </COF>
        <ADJ>IGUILTY       GUILTY        261020110000 </ADJ>
        <DIS>I4047    30102011                                                                                        </DIS>
      </ASI>
      <GMT>000010073ENQR000331R</GMT>
    </CXE01>`,
    expectedRequest: "",
    count: 1
  },
  mockUpdate("CXU04", {
    expectedRequest:
      "<FSC>K01YZ</FSC><IDS>K21/20Q     SENDEF                  </IDS><SUB>I2576                                                                       30102011D</SUB><CCR>K21/2732/15Y                   </CCR><CCH>K001              TH68006 </CCH><DIS>I1116    17052013          00                                                                            </DIS>",
    count: 1
  })
]
