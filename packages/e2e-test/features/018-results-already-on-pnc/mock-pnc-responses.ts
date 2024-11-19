import { mockUpdate } from "../../utils/pncMocks"

export default () => [
  {
    matchRegex: "CXE01",
    response: `<?xml version="1.0" standalone="yes"?>
    <CXE01>
      <GMH>073ENQR000687RENQASIPNCA05A73000017300000120210903101273000001                                             050002861</GMH>
      <ASI>
        <FSC>K01ZD</FSC>
        <IDS>K21/1V      NXONE                   </IDS>
        <CCR>K21/2732/1H                    </CCR>
        <COF>K001    5:5:5:1      TH68006 28112010                </COF>
      </ASI>
      <GMT>000008073ENQR000687R</GMT>
    </CXE01>`,
    expectedRequest: "",
    count: 1
  },
  mockUpdate("CXU02", {
    expectedRequest:
      "<FSC>K01YZ</FSC><IDS>K21/1V      NXONE                   </IDS><CCR>K21/2732/1H                    </CCR><COU>I2576                                                                       NXONE/LOG                                             260920110000</COU><CCH>K001              TH68006 </CCH><ADJ>INOT GUILTY   GUILTY        260920110000 </ADJ><DIS>I1002M12                   00                                                                            </DIS>",
    count: 1
  }),
  {
    matchRegex: "CXE01",
    response: `<?xml version="1.0" standalone="yes"?>
    <CXE01>
      <GMH>073ENQR000688RENQASIPNCA05A73000017300000120210903101273000001                                             050002863</GMH>
      <ASI>
        <FSC>K01ZD</FSC>
        <IDS>K21/1V      NXONE                   </IDS>
        <CCR>K21/2732/1H                    </CCR>
        <COF>K001    5:5:5:1      TH68006 28112010                </COF>
        <ADJ>INOT GUILTY   GUILTY        260920110000 </ADJ>
        <DIS>I1002M12                                                                                                 </DIS>
      </ASI>
      <GMT>000010073ENQR000688R</GMT>
    </CXE01>`,
    expectedRequest: "",
    count: 1
  }
]
