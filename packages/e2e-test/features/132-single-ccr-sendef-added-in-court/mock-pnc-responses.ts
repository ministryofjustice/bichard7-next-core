import { mockUpdate } from "../../utils/pncMocks"

export default () => [
  {
    matchRegex: "CXE01",
    response: `<?xml version="1.0" standalone="yes"?>
    <CXE01>
      <GMH>073ENQR000305RENQASIPNCA05A73000017300000120210906105873000001                                             050002182</GMH>
      <ASI>
        <FSC>K01ZD</FSC>
        <IDS>K21/2W      SENDEFOFFENC            </IDS>
        <CCR>K21/2732/1H                    </CCR>
        <COF>K001    5:5:5:1      TH68006 01092010                </COF>
        <COF>K002    5:7:11:10    TH68151 01092010                </COF>
        <COF>K003    5:5:8:1      TH68010 01092010                </COF>
      </ASI>
      <GMT>000010073ENQR000305R</GMT>
    </CXE01>`,
    expectedRequest: "",
    count: 1
  },
  mockUpdate("CXU02", {
    expectedRequest:
      "<FSC>K01YZ</FSC><IDS>K21/2W      SENDEFOFFENC            </IDS><CCR>K21/2732/1H                    </CCR><COU>I2576                                                                       SENDEFOFFENCEADDED/ONECCR                             260920100000</COU><CCH>K001              TH68006 </CCH><ADJ>INOT GUILTY   GUILTY        260920100000 </ADJ><DIS>I4011    26102010          00                                                                            </DIS><CCH>K002              TH68151 </CCH><ADJ>INOT GUILTY   GUILTY        260920100000 </ADJ><DIS>I4011    26102010          00                                                                            </DIS><CCH>K003              TH68010 </CCH><ADJ>INOT GUILTY   GUILTY        260920100000 </ADJ><DIS>I4011    26102010          00                                                                            </DIS>",
    count: 1
  }),
  mockUpdate("CXU01", {
    expectedRequest:
      "<FSC>K01YZ</FSC><IDS>K21/2W      SENDEFOFFENC            </IDS><ASR>K11/01ZD/01/410856R                    </ASR><REM>I26092010B    2576                                                                       261020102576                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      0000                                                                                                                                                                              </REM>",
    count: 1
  }),
  {
    matchRegex: "CXE01",
    response: `<?xml version="1.0" standalone="yes"?>
    <CXE01>
      <GMH>073ENQR000153RENQASIPNCA05A73000017300000120210906105873000001                                             050001962</GMH>
      <ASI>
        <FSC>K01ZD</FSC>
        <IDS>K21/2W      SENDEFOFFENC            </IDS>
        <CCR>K21/2732/1H                    </CCR>
        <COF>K001    5:5:5:1      TH68006 01092010                </COF>
        <ADJ>INOT GUILTY   GUILTY        260920100000 </ADJ>
        <DIS>I4011    26102010                                                                                        </DIS>
        <COF>K002    5:7:11:10    TH68151 01092010                </COF>
        <ADJ>INOT GUILTY   GUILTY        260920100000 </ADJ>
        <DIS>I4011    26102010                                                                                        </DIS>
        <COF>K003    5:5:8:1      TH68010 01092010                </COF>
        <ADJ>INOT GUILTY   GUILTY        260920100000 </ADJ>
        <DIS>I4011    26102010                                                                                        </DIS>
      </ASI>
      <GMT>000016073ENQR000153R</GMT>
    </CXE01>`,
    expectedRequest: "",
    count: 1
  },
  mockUpdate("CXU04", {
    expectedRequest:
      "<FSC>K01YZ</FSC><IDS>K21/2W      SENDEFOFFENC            </IDS><SUB>I2576                                                                       26102010D</SUB><CCR>K21/2732/1H                    </CCR><CCH>K001              TH68006 </CCH><DIS>I1002M9                    00                                                                            </DIS><CCH>K002              TH68151 </CCH><DIS>I1002M10                   00                                                                            </DIS><CCH>K003              TH68010 </CCH><DIS>I1002M11                   00                                                                            </DIS>",
    count: 1
  })
]
