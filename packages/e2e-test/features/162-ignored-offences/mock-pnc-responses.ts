import { mockUpdate } from "../../utils/pncMocks"

export default () => [
  {
    matchRegex: "CXE01",
    response: `<?xml version="1.0" standalone="yes"?>
    <CXE01>
      <GMH>073ENQR000708RENQASIPNCA05A73000017300000120210903102373000001                                             050002907</GMH>
      <ASI>
        <FSC>K01ZD</FSC>
        <IDS>K21/14J     RESULT                  </IDS>
        <CCR>K21/2732/10T                   </CCR>
        <COF>K001                 RR84042 28112010                </COF>
        <COF>K002                 RR84043 17112010                </COF>
      </ASI>
      <GMT>000009073ENQR000708R</GMT>
    </CXE01>`,
    expectedRequest: "",
    count: 1
  },
  mockUpdate("CXU02", {
    expectedRequest:
      "<FSC>K01YZ</FSC><IDS>K21/14J     RESULT                  </IDS><CCR>K21/2732/10T                   </CCR><COU>I2576                                                                       RESULT/FRANKLIN                                       260920110000</COU><CCH>K001              RR84042 </CCH><ADJ>INOT GUILTY   GUILTY        260920110000 </ADJ><DIS>I4013    03012012          00                                                                            </DIS><CCH>K002              RR84043 </CCH><ADJ>INOT GUILTY   GUILTY        260920110000 </ADJ><DIS>I4013    03012012          00                                                                            </DIS>",
    count: 1
  }),
  mockUpdate("CXU01", {
    expectedRequest:
      "<FSC>K01YZ</FSC><IDS>K21/14J     RESULT                  </IDS><ASR>K11/01ZD/01/410908Y                    </ASR><REM>I26092011B    2576                                                                       030120122576                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      0000                                                                                                                                                                              </REM>",
    count: 1
  }),
  {
    matchRegex: "CXE01",
    response: `<?xml version="1.0" standalone="yes"?>
    <CXE01>
      <GMH>073ENQR000709RENQASIPNCA05A73000017300000120210903102373000001                                             050002910</GMH>
      <ASI>
        <FSC>K01ZD</FSC>
        <IDS>K21/14J     RESULT                  </IDS>
        <CCR>K21/2732/10T                   </CCR>
        <COF>K001                 RR84042 28112010                </COF>
        <ADJ>INOT GUILTY   GUILTY        260920110000W</ADJ>
        <DIS>I4013    03012012                                                                                        </DIS>
        <COF>K002                 RR84043 17112010                </COF>
        <ADJ>INOT GUILTY   GUILTY        260920110000W</ADJ>
        <DIS>I4013    03012012                                                                                        </DIS>
      </ASI>
      <GMT>000013073ENQR000709R</GMT>
    </CXE01>`,
    expectedRequest: "",
    count: 1
  },
  mockUpdate("CXU04", {
    expectedRequest:
      "<FSC>K01YZ</FSC><IDS>K21/14J     RESULT                  </IDS><SUB>I2576                                                                       03012012D</SUB><CCR>K21/2732/10T                   </CCR><CCH>K001              RR84042 </CCH><DIS>I1002M12                   00                                                                            </DIS><CCH>K002              RR84043 </CCH><DIS>I1002M12                   00                                                                            </DIS>",
    count: 1
  })
]
