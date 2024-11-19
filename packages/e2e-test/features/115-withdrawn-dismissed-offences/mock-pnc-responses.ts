import { mockUpdate } from "../../utils/pncMocks"

export default () => [
  {
    matchRegex: "CXE01",
    response: `<?xml version="1.0" standalone="yes"?>
    <CXE01>
      <GMH>073ENQR000694RENQASIPNCA05A73000017300000120210903101573000001                                             050002875</GMH>
      <ASI>
        <FSC>K01VK</FSC>
        <IDS>K21/9D      OFFENCES                </IDS>
        <CCR>K21/2812/3G                    </CCR>
        <COF>K001    5:5:5:1      TH68006 28112006                </COF>
        <COF>K002    5:7:11:10    TH68151 28112006                </COF>
        <COF>K003    5:5:2:1      TH68001 28112006                </COF>
        <COF>K004    5:5:6:1      TH68007 28112006                </COF>
      </ASI>
      <GMT>000011073ENQR000694R</GMT>
    </CXE01>`,
    expectedRequest: "",
    count: 1
  },
  mockUpdate("CXU02", {
    expectedRequest:
      "<FSC>K01YZ</FSC><IDS>K21/9D      OFFENCES                </IDS><CCR>K21/2812/3G                    </CCR><COU>I2576                                                                       OFFENCES/DISMISSED                                    080520090000</COU><CRT>I2576                                                                       01112009</CRT><CCH>K001              TH68006 </CCH><ADJ>INOT GUILTY   NOT GUILTY    080520090000 </ADJ><DIS>I2006                      00                                                                            </DIS><CCH>K002              TH68151 </CCH><ADJ>INOT GUILTY   NOT GUILTY    080520090000 </ADJ><DIS>I2006                      00                                                                            </DIS><CCH>K003              TH68001 </CCH><ADJ>INOT GUILTY                         0000 </ADJ><DIS>I2059                      00                                                                            </DIS><CCH>K004              TH68007 </CCH><ADJ>INOT GUILTY                         0000 </ADJ><DIS>I2059                      00                                                                            </DIS>",
    count: 1
  }),
  mockUpdate("CXU01", {
    expectedRequest:
      "<FSC>K01YZ</FSC><IDS>K21/9D      OFFENCES                </IDS><ASR>K11/01VK/01/376263Q                    </ASR><REM>I08052009B    2576                                                                       011120092576                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      0000                                                                                                                                                                              </REM>",
    count: 1
  }),
  {
    matchRegex: "CXE01",
    response: `<?xml version="1.0" standalone="yes"?>
    <CXE01>
      <GMH>073ENQR000695RENQASIPNCA05A73000017300000120210903102073000001                                             050002878</GMH>
      <ASI>
        <FSC>K01VK</FSC>
        <IDS>K21/9D      OFFENCES                </IDS>
        <CCR>K21/2812/3G                    </CCR>
        <COF>K001    5:5:5:1      TH68006 28112006                </COF>
        <ADJ>INOT GUILTY   NOT GUILTY    080520090000 </ADJ>
        <DIS>I2006                                                                                                    </DIS>
        <COF>K002    5:7:11:10    TH68151 28112006                </COF>
        <ADJ>INOT GUILTY   NOT GUILTY    080520090000 </ADJ>
        <DIS>I2006                                                                                                    </DIS>
        <CCR>K21/2732/24H                   </CCR>
        <COF>K001    5:5:2:1      TH68001 28112006                </COF>
        <COF>K002    5:5:6:1      TH68007 28112006                </COF>
      </ASI>
      <GMT>000016073ENQR000695R</GMT>
    </CXE01>`,
    expectedRequest: "",
    count: 1
  },
  mockUpdate("CXU02", {
    expectedRequest:
      "<FSC>K01YZ</FSC><IDS>K21/9D      OFFENCES                </IDS><CCR>K21/2732/24H                   </CCR><COU>I2576                                                                       OFFENCES/DISMISSED                                    011120080000</COU><CCH>K001              TH68001 </CCH><ADJ>INOT GUILTY   GUILTY        011120080000 </ADJ><DIS>I4011    02122008          00                                                                            </DIS><CCH>K002              TH68007 </CCH><ADJ>INOT GUILTY   GUILTY        011120080000 </ADJ><DIS>I4011    02122008          00                                                                            </DIS>",
    count: 1
  }),
  mockUpdate("CXU01", {
    expectedRequest:
      "<FSC>K01YZ</FSC><IDS>K21/9D      OFFENCES                </IDS><ASR>K11/01VK/01/376263Q                    </ASR><REM>I01112008B    2576                                                                       021220082576                                                                       GIVE TO THE COURT ANY PASSPORT HELD                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            0000                                                                                                                                                                              </REM>",
    count: 1
  }),
  {
    matchRegex: "CXE01",
    response: `<?xml version="1.0" standalone="yes"?>
    <CXE01>
      <GMH>073ENQR000696RENQASIPNCA05A73000017300000120210903102073000001                                             050002881</GMH>
      <ASI>
        <FSC>K01VK</FSC>
        <IDS>K21/9D      OFFENCES                </IDS>
        <CCR>K21/2812/3G                    </CCR>
        <COF>K001    5:5:5:1      TH68006 28112006                </COF>
        <ADJ>INOT GUILTY   NOT GUILTY    080520090000 </ADJ>
        <DIS>I2006                                                                                                    </DIS>
        <COF>K002    5:7:11:10    TH68151 28112006                </COF>
        <ADJ>INOT GUILTY   NOT GUILTY    080520090000 </ADJ>
        <DIS>I2006                                                                                                    </DIS>
        <CCR>K21/2732/24H                   </CCR>
        <COF>K001    5:5:2:1      TH68001 28112006                </COF>
        <ADJ>INOT GUILTY   GUILTY        011120080000 </ADJ>
        <DIS>I4011    02122008                                                                                        </DIS>
        <COF>K002    5:5:6:1      TH68007 28112006                </COF>
        <ADJ>INOT GUILTY   GUILTY        011120080000 </ADJ>
        <DIS>I4011    02122008                                                                                        </DIS>
      </ASI>
      <GMT>000020073ENQR000696R</GMT>
    </CXE01>`,
    expectedRequest: "",
    count: 1
  },
  mockUpdate("CXU04", {
    expectedRequest:
      "<FSC>K01YZ</FSC><IDS>K21/9D      OFFENCES                </IDS><SUB>I2576                                                                       02122008D</SUB><CCR>K21/2732/24H                   </CCR><CCH>K001              TH68001 </CCH><DIS>I1116    29052009          00                                                                            </DIS><DIS>I3101H100                  00                                                                            </DIS><CCH>K002              TH68007 </CCH><DIS>I1116    29052009          00                                                                            </DIS><DIS>I3101H19                   00                                                                            </DIS>",
    count: 1
  })
]
