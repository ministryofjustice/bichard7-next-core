import { mockUpdate } from "../../utils/pncMocks"

export default () => [
  {
    matchRegex: "CXE01",
    response: `<?xml version="1.0" standalone="yes"?>
    <CXE01>
      <GMH>073ENQR000311RENQASIPNCA05A73000017300000120210901125573000001                                             050002301</GMH>
      <ASI>
        <FSC>K01VK</FSC>
        <IDS>K21/9D      CHANGES                 </IDS>
        <CCR>K21/2769/9H                    </CCR>
        <COF>K001    5:5:5:1      TH68006 28112006                </COF>
        <COF>K002    5:7:11:10    TH68151 28112006                </COF>
        <COF>K003    12:15:13:1   RT88191 28112006                </COF>
      </ASI>
      <GMT>000010073ENQR000311R</GMT>
    </CXE01>`,
    expectedRequest: "",
    count: 1
  },
  mockUpdate("CXU02", {
    expectedRequest:
      "<FSC>K01YZ</FSC><IDS>K21/9D      CHANGES                 </IDS><CCR>K21/2769/9H                    </CCR><COU>I2574                                                                       CHANGES/PSACODE                                       260920080000</COU><CCH>K001              TH68006 </CCH><ADJ>INOT GUILTY   GUILTY        260920080000 </ADJ><DIS>I1016                      00                                                                            </DIS><CCH>K002              TH68151 </CCH><ADJ>INOT GUILTY   GUILTY        260920080000 </ADJ><DIS>I1015            0000100.0000                                                                            </DIS><CCH>K003              RT88191 </CCH><ADJ>INOT GUILTY   GUILTY        260920080000 </ADJ><DIS>I1015            0000200.0000                                                                            </DIS><ASR>K10/01VK/01/375807W                    </ASR><ACH>I                                                                                                                                            TH68006                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     NKINGSTON HIGH STREET                                                                                                                                                                                                                   01VK29112006                </ACH><ADJ>INOT GUILTY   NOT GUILTY    260920080000 </ADJ><DIS>I2004                      00                                                                            </DIS><ACH>I                                                                                                                                            RT88026                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     NKINGSTON HIGH STREET                                                                                                                                                                                                                   01VK28112006                </ACH><ADJ>INOT GUILTY   GUILTY        260920080000 </ADJ><DIS>I1015            0000300.0000                                                                            </DIS>",
    count: 1
  })
]
