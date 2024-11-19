import { mockUpdate } from "../../utils/pncMocks"

export default () => [
  {
    count: 1,
    expectedRequest: "",
    matchRegex: "CXE01",
    response: `<?xml version="1.0" standalone="yes"?>
    <CXE01>
      <GMH>073ENQR000706RENQASIPNCA05A73000017300000120210903102273000001                                             050002904</GMH>
      <ASI>
        <FSC>K01ZD</FSC>
        <IDS>K21/13H     JUDGE                   </IDS>
        <CCR>K21/2732/9R                    </CCR>
        <COF>K001                 RR84042 28112010                </COF>
      </ASI>
      <GMT>000008073ENQR000706R</GMT>
    </CXE01>`
  },
  mockUpdate("CXU02", {
    count: 1,
    expectedRequest:
      "<FSC>K01YZ</FSC><IDS>K21/13H     JUDGE                   </IDS><CCR>K21/2732/9R                    </CCR><COU>I2576                                                                       JUDGE/FRANKLIN                                        260920110000</COU><CCH>K001              RR84042 </CCH><ADJ>INOT GUILTY   GUILTY        260920110000 </ADJ><DIS>I1002M12                   00                                                                            </DIS>"
  }),
  {
    count: 1,
    expectedRequest: "",
    matchRegex: "CXE01",
    response: `<?xml version="1.0" standalone="yes"?>
    <CXE01>
      <GMH>073ENQR000707RENQASIPNCA05A73000017300000120210903102273000001                                             050002906</GMH>
      <ASI>
        <FSC>K01ZD</FSC>
        <IDS>K21/13H     JUDGE                   </IDS>
        <CCR>K21/2732/9R                    </CCR>
        <COF>K001                 RR84042 28112010                </COF>
        <ADJ>INOT GUILTY   GUILTY        260920110000 </ADJ>
        <DIS>I1002M12                                                                                                 </DIS>
      </ASI>
      <GMT>000010073ENQR000707R</GMT>
    </CXE01>`
  }
]
