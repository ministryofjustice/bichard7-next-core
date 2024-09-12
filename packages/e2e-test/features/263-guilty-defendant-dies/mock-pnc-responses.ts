import { mockUpdate } from "../../utils/pncMocks"

export default () => [
  {
    matchRegex: "CXE01",
    response: `<?xml version="1.0" standalone="yes"?>
    <CXE01>
      <GMH>073ENQR000724RENQASIPNCA05A73000017300000120210903102673000001                                             050002942</GMH>
      <ASI>
        <FSC>K01ZD</FSC>
        <IDS>K21/26X     POSTADJUDICA            </IDS>
        <CCR>K21/2732/20D                   </CCR>
        <COF>K001    5:7:11:10    TH68151 28112006                </COF>
      </ASI>
      <GMT>000008073ENQR000724R</GMT>
    </CXE01>`,
    expectedRequest: "",
    count: 1
  },
  mockUpdate("CXU02", {
    expectedRequest:
      "<FSC>K01YZ</FSC><IDS>K21/26X     POSTADJUDICA            </IDS><CCR>K21/2732/20D                   </CCR><COU>I2576                                                                       POSTADJUDICATION/PASSAWAY                             260920110000</COU><CCH>K001              TH68151 </CCH><ADJ>INOT GUILTY   GUILTY        260920110000 </ADJ><DIS>I4047    26102011          00                                                                            </DIS>",
    count: 1
  }),
  mockUpdate("CXU01", {
    expectedRequest:
      "<FSC>K01YZ</FSC><IDS>K21/26X     POSTADJUDICA            </IDS><ASR>K12/01ZD/01/448750E                    </ASR><REM>I26092011B    2576                                                                       261020112576                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      0000                                                                                                                                                                              </REM>",
    count: 1
  }),
  {
    matchRegex: "CXE01",
    response: `<?xml version="1.0" standalone="yes"?>
    <CXE01>
      <GMH>073ENQR000725RENQASIPNCA05A73000017300000120210903102673000001                                             050002945</GMH>
      <ASI>
        <FSC>K01ZD</FSC>
        <IDS>K21/26X     POSTADJUDICA            </IDS>
        <CCR>K21/2732/20D                   </CCR>
        <COF>K001    5:7:11:10    TH68151 28112006                </COF>
        <ADJ>INOT GUILTY   GUILTY        260920110000 </ADJ>
        <DIS>I4047    26102011                                                                                        </DIS>
      </ASI>
      <GMT>000010073ENQR000725R</GMT>
    </CXE01>`,
    expectedRequest: "",
    count: 1
  },
  mockUpdate("CXU04", {
    expectedRequest:
      "<FSC>K01YZ</FSC><IDS>K21/26X     POSTADJUDICA            </IDS><SUB>I2576                                                                       26102011D</SUB><CCR>K21/2732/20D                   </CCR><CCH>K001              TH68151 </CCH><DIS>I2065                      00                                                                            </DIS>",
    count: 1
  })
]
