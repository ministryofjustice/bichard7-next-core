import { mockUpdate } from "../../utils/pncMocks"

export default () => [
  {
    matchRegex: "CXE01",
    response: `<?xml version="1.0" standalone="yes"?>
    <CXE01>
      <GMH>073ENQR000714RENQASIPNCA05A73000017300000120210903102473000001                                             050002920</GMH>
      <ASI>
        <FSC>K01ZD</FSC>
        <IDS>K21/19P     ADDEDOFFENCE            </IDS>
        <CCR>K21/2732/13W                   </CCR>
        <COF>K001    5:5:8:1      TH68010 25092010                </COF>
      </ASI>
      <GMT>000008073ENQR000714R</GMT>
    </CXE01>`,
    expectedRequest: "",
    count: 1
  },
  mockUpdate("CXU02", {
    expectedRequest:
      "<FSC>K01YZ</FSC><IDS>K21/19P     ADDEDOFFENCE            </IDS><CCR>K21/2732/13W                   </CCR><COU>I2576                                                                       ADDEDOFFENCESENTENCE/PNCADJ                           011020110000</COU><CCH>K001              TH68010 </CCH><ADJ>INOT GUILTY   GUILTY        011020110000 </ADJ><DIS>I4004    01012012          00                                                                            </DIS>",
    count: 1
  }),
  mockUpdate("CXU01", {
    expectedRequest:
      "<FSC>K01YZ</FSC><IDS>K21/19P     ADDEDOFFENCE            </IDS><ASR>K11/01ZD/01/445111A                    </ASR><REM>I01102011B    2576                                                                       010120122576                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      0000                                                                                                                                                                              </REM>",
    count: 1
  }),
  {
    matchRegex: "CXE01",
    response: `<?xml version="1.0" standalone="yes"?>
    <CXE01>
      <GMH>073ENQR000715RENQASIPNCA05A73000017300000120210903102473000001                                             050002923</GMH>
      <ASI>
        <FSC>K01ZD</FSC>
        <IDS>K21/19P     ADDEDOFFENCE            </IDS>
        <CCR>K21/2732/13W                   </CCR>
        <COF>K001    5:5:8:1      TH68010 25092010                </COF>
        <ADJ>INOT GUILTY   GUILTY        011020110000 </ADJ>
        <DIS>I4004    01012012                                                                                        </DIS>
      </ASI>
      <GMT>000010073ENQR000715R</GMT>
    </CXE01>`,
    expectedRequest: "",
    count: 1
  }
]
