import { mockUpdate } from "../../utils/pncMocks"

export default () => [
  {
    matchRegex: "CXE01",
    response: `<?xml version="1.0" standalone="yes"?>
    <CXE01>
      <GMH>073ENQR000316RENQASIPNCA05A73000017300000120210901125773000001                                             050002311</GMH>
      <ASI>
        <FSC>K01VK</FSC>
        <IDS>K21/11F     SENDNEW                 </IDS>
        <CCR>K21/2812/1E                    </CCR>
        <COF>K001    5:5:5:1      TH68006 01092010                </COF>
        <COF>K002    5:7:11:10    TH68151 01092010                </COF>
        <COF>K003    5:5:8:1      TH68010 01092010                </COF>
      </ASI>
      <GMT>000010073ENQR000316R</GMT>
    </CXE01>`,
    expectedRequest: "",
    count: 1
  },
  mockUpdate("CXU02", {
    expectedRequest:
      "<FSC>K01YZ</FSC><IDS>K21/11F     SENDNEW                 </IDS><CCR>K21/2812/1E                    </CCR><COU>I2576                                                                       SENDNEW/ONECCR                                        260920100000</COU><CCH>K001              TH68006 </CCH><ADJ>INOT GUILTY   GUILTY        260920100000 </ADJ><DIS>I4011    26102010          00                                                                            </DIS><CCH>K002              TH68151 </CCH><ADJ>INOT GUILTY   GUILTY        260920100000 </ADJ><DIS>I4011    26102010          00                                                                            </DIS><CCH>K003              TH68010 </CCH><ADJ>INOT GUILTY   GUILTY        260920100000 </ADJ><DIS>I4011    26102010          00                                                                            </DIS>",
    count: 1
  }),
  mockUpdate("CXU01", {
    expectedRequest:
      "<FSC>K01YZ</FSC><IDS>K21/11F     SENDNEW                 </IDS><ASR>K11/01VK/01/376518T                    </ASR><REM>I26092010B    2576                                                                       261020102576                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      0000                                                                                                                                                                              </REM>",
    count: 1
  }),
  {
    matchRegex: "CXE01",
    response: `<?xml version="1.0" standalone="yes"?>
    <CXE01>
      <GMH>073ENQR000317RENQASIPNCA05A73000017300000120210901125773000001                                             050002314</GMH>
      <ASI>
        <FSC>K01VK</FSC>
        <IDS>K21/11F     SENDNEW                 </IDS>
        <CCR>K21/2812/1E                    </CCR>
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
      <GMT>000016073ENQR000317R</GMT>
    </CXE01>`,
    expectedRequest: "",
    count: 1
  }
]
