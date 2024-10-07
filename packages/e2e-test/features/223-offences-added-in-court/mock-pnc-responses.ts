import { mockUpdate } from "../../utils/pncMocks"

export default () => [
  {
    matchRegex: "CXE01",
    response: `<?xml version="1.0" standalone="yes"?>
    <CXE01>
      <GMH>073ENQR000149RENQASIPNCA05A73000017300000120210906105273000001                                             050001951</GMH>
      <ASI>
        <FSC>K01ZD</FSC>
        <IDS>K21/5Z      ADDEDOFFENCE            </IDS>
        <CCR>K21/2732/4L                    </CCR>
        <COF>K001    5:5:8:1      TH68010 25092010                </COF>
      </ASI>
      <GMT>000008073ENQR000149R</GMT>
    </CXE01>`,
    expectedRequest: "",
    count: 1
  },
  mockUpdate("CXU02", {
    expectedRequest:
      "<FSC>K01YZ</FSC><IDS>K21/5Z      ADDEDOFFENCE            </IDS><CCR>K21/2732/4L                    </CCR><COU>I2576                                                                       ADDEDOFFENCEAPJ/PNCADJ                                011020110000</COU><CCH>K001              TH68010 </CCH><ADJ>INOT GUILTY   GUILTY        011020110000 </ADJ><DIS>I4004    01012012          00                                                                            </DIS>",
    count: 1
  }),
  mockUpdate("CXU01", {
    expectedRequest:
      "<FSC>K01YZ</FSC><IDS>K21/5Z      ADDEDOFFENCE            </IDS><ASR>K12/01ZD/01/445110Y                    </ASR><REM>I01102011B    2576                                                                       010120122576                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      0000                                                                                                                                                                              </REM>",
    count: 1
  }),
  {
    matchRegex: "CXE01",
    response: `<?xml version="1.0" standalone="yes"?>
    <CXE01>
      <GMH>073ENQR000150RENQASIPNCA05A73000017300000120210906105273000001                                             050001954</GMH>
      <ASI>
        <FSC>K01ZD</FSC>
        <IDS>K21/5Z      ADDEDOFFENCE            </IDS>
        <CCR>K21/2732/4L                    </CCR>
        <COF>K001    5:5:8:1      TH68010 25092010                </COF>
        <ADJ>INOT GUILTY   GUILTY        011020110000 </ADJ>
        <DIS>I4004    01012012                                                                                        </DIS>
      </ASI>
      <GMT>000010073ENQR000150R</GMT>
    </CXE01>`,
    expectedRequest: "",
    count: 1
  },
  mockUpdate("CXU01", {
    expectedRequest:
      "<FSC>K01YZ</FSC><IDS>K21/5Z      ADDEDOFFENCE            </IDS><ASR>K12/01ZD/01/445110Y                    </ASR><REM>I01012012B    2576                                                                       010220122576                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      0000                                                                                                                                                                              </REM>",
    count: 1
  })
]