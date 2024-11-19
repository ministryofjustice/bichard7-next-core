import { mockUpdate } from "../../utils/pncMocks"

export default () => [
  {
    matchRegex: "CXE01",
    response: `<?xml version="1.0" standalone="yes"?>
    <CXE01>
      <GMH>073ENQR000491RENQASIPNCA05A73000017300000120210908114273000001                                             050002399</GMH>
      <ASI>
        <FSC>K01ZD</FSC>
        <IDS>K12/29N     TOSINGLECCR             </IDS>
        <CCR>K13/2732/3W                    </CCR>
        <COF>K001    5:5:8:1      TH68010 25092011                </COF>
        <CCR>K13/2732/4X                    </CCR>
        <COF>K001    1:8:11:1     CJ88001 25092011                </COF>
      </ASI>
      <GMT>000010073ENQR000491R</GMT>
    </CXE01>`,
    expectedRequest: "",
    count: 1
  },
  {
    matchRegex: "CXE01",
    response: `<?xml version="1.0" standalone="yes"?>
    <CXE01>
      <GMH>073ENQR000492RENQASIPNCA05A73000017300000120210908114373000001                                             050002400</GMH>
      <ASI>
        <FSC>K01ZD</FSC>
        <IDS>K21/4Y      TOSINGLECCR             </IDS>
        <CCR>K21/2732/4L                    </CCR>
        <COF>K001    5:5:8:1      TH68010 25092011                </COF>
        <COF>K002    1:8:11:1     CJ88001 25092011                </COF>
      </ASI>
      <GMT>000009073ENQR000492R</GMT>
    </CXE01>`,
    expectedRequest: "",
    count: 1
  },
  mockUpdate("CXU02", {
    expectedRequest:
      "<FSC>K01YZ</FSC><IDS>K21/4Y      TOSINGLECCR             </IDS><CCR>K21/2732/4L                    </CCR><COU>I2576                                                                       TOSINGLECCRX/MULTIPLECCR                              011120110000</COU><CCH>K001              TH68010 </CCH><ADJ>INOT GUILTY   GUILTY        011120110000 </ADJ><DIS>I1002M12                   00                                                                            </DIS><DIS>I3025Y999                  00            SEA MONKEY                                                      </DIS><CCH>K002              CJ88001 </CCH><ADJ>INOT GUILTY   GUILTY        011120110000 </ADJ><DIS>I1002M14                   00                                                                            </DIS><DIS>I3107                      00                                                                            </DIS>"
  })
]
