import { mockUpdate } from "../../utils/pncMocks"

export default () => [
  {
    matchRegex: "CXE01",
    response: `<?xml version="1.0" standalone="yes"?>
    <CXE01>
      <GMH>073ENQR000306RENQASIPNCA05A73000017300000120210901124873000001                                             050002291</GMH>
      <ASI>
        <FSC>K01ZD</FSC>
        <IDS>K21/6A      LEBOWSKI                </IDS>
        <CCR>K21/2732/6N                    </CCR>
        <COF>K001    5:5:5:1      TH68006 28112010                </COF>
        <COF>K002    5:7:11:10    TH68151 28112010                </COF>
        <COF>K003    12:15:13:1   RT88191 28112010                </COF>
      </ASI>
      <GMT>000010073ENQR000306R</GMT>
    </CXE01>`,
    expectedRequest: "",
    count: 1
  },
  mockUpdate("CXU02", {
    expectedRequest:
      "<FSC>K01YZ</FSC><IDS>K21/6A      LEBOWSKI                </IDS><CCR>K21/2732/6N                    </CCR><COU>I2576                                                                       LEBOWSKI/JEFFREY                                      250920110000</COU><CCH>K001              TH68006 </CCH><ADJ>INOT GUILTY   GUILTY        250920110000 </ADJ><DIS>I2007                      00                                                                            </DIS><CCH>K002              TH68151 </CCH><ADJ>INOT GUILTY   GUILTY        250920110000 </ADJ><DIS>I2007                      00                                                                            </DIS><CCH>K003              RT88191 </CCH><ADJ>INOT GUILTY   GUILTY        250920110000 </ADJ><DIS>I2007                      00                                                                            </DIS>",
    count: 1
  }),
  {
    matchRegex: "CXE01",
    response: `<?xml version="1.0" standalone="yes"?>
    <CXE01>
      <GMH>073ENQR000307RENQASIPNCA05A73000017300000120210901124873000001                                             050002293</GMH>
      <ASI>
        <FSC>K01ZD</FSC>
        <IDS>K21/6A      LEBOWSKI                </IDS>
        <CCR>K21/2732/6N                    </CCR>
        <COF>K001    5:5:5:1      TH68006 28112010                </COF>
        <ADJ>INOT GUILTY   GUILTY        250920110000 </ADJ>
        <DIS>I2007                                                                                                    </DIS>
        <COF>K002    5:7:11:10    TH68151 28112010                </COF>
        <ADJ>INOT GUILTY   GUILTY        250920110000 </ADJ>
        <DIS>I2007                                                                                                    </DIS>
        <COF>K003    12:15:13:1   RT88191 28112010                </COF>
        <ADJ>INOT GUILTY   GUILTY        250920110000 </ADJ>
        <DIS>I2007                                                                                                    </DIS>
      </ASI>
      <GMT>000016073ENQR000307R</GMT>
    </CXE01>`,
    expectedRequest: "",
    count: 1
  },
  mockUpdate("CXU03", {
    expectedRequest:
      "<FSC>K01YZ</FSC><IDS>K21/6A      LEBOWSKI                </IDS><SUB>I2576                                                                       26102011V</SUB><CCR>K21/2732/6N                    </CCR><CCH>K001              TH68006 </CCH><ADJ>INOT GUILTY   GUILTY        261020110000 </ADJ><DIS>I1015            0000101.0000                                                                            </DIS><DIS>I3027    25092011          00                                                                            </DIS><CCH>K002              TH68151 </CCH><ADJ>INOT GUILTY   GUILTY        261020110000 </ADJ><DIS>I1015            0000102.0000                                                                            </DIS><DIS>I3027    25092011          00                                                                            </DIS><CCH>K003              RT88191 </CCH><ADJ>INOT GUILTY   GUILTY        261020110000 </ADJ><DIS>I1015            0000103.0000                                                                            </DIS><DIS>I3027    25092011          00                                                                            </DIS>",
    count: 1
  })
]
