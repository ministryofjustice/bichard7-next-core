import { mockUpdate } from "../../utils/pncMocks"

export default () => [
  {
    matchRegex: "CXE01",
    response: `<?xml version="1.0" standalone="yes"?>
    <CXE01>
      <GMH>073ENQR000720RENQASIPNCA05A73000017300000120210903102573000001                                             050002933</GMH>
      <ASI>
        <FSC>K01ZD</FSC>
        <IDS>K21/22T     SINEDIE                 </IDS>
        <CCR>K21/2732/16Z                   </CCR>
        <COF>K001    5:5:5:1      TH68006 28112010                </COF>
        <COF>K002    5:7:11:10    TH68151 28112010                </COF>
      </ASI>
      <GMT>000009073ENQR000720R</GMT>
    </CXE01>`,
    expectedRequest: "",
    count: 1
  },
  mockUpdate("CXU02", {
    expectedRequest:
      "<FSC>K01YZ</FSC><IDS>K21/22T     SINEDIE                 </IDS><CCR>K21/2732/16Z                   </CCR><COU>I2576                                                                       SINEDIE/WITHDRAWN                                     260920110000</COU><CCH>K001              TH68006 </CCH><ADJ>INO PLEA TAKENNON-CONVICTION260920110000 </ADJ><DIS>I2007                      00                                                                            </DIS><CCH>K002              TH68151 </CCH><ADJ>INO PLEA TAKENNON-CONVICTION260920110000 </ADJ><DIS>I2007                      00                                                                            </DIS>",
    count: 1
  }),
  {
    matchRegex: "CXE01",
    response: `<?xml version="1.0" standalone="yes"?>
    <CXE01>
      <GMH>073ENQR000721RENQASIPNCA05A73000017300000120210903102573000001                                             050002935</GMH>
      <ASI>
        <FSC>K01ZD</FSC>
        <IDS>K21/22T     SINEDIE                 </IDS>
        <CCR>K21/2732/16Z                   </CCR>
        <COF>K001    5:5:5:1      TH68006 28112010                </COF>
        <ADJ>INO PLEA TAKENNON-CONVICTION260920110000 </ADJ>
        <DIS>I2007                                                                                                    </DIS>
        <COF>K002    5:7:11:10    TH68151 28112010                </COF>
        <ADJ>INO PLEA TAKENNON-CONVICTION260920110000 </ADJ>
        <DIS>I2007                                                                                                    </DIS>
      </ASI>
      <GMT>000013073ENQR000721R</GMT>
    </CXE01>`,
    expectedRequest: "",
    count: 1
  },
  mockUpdate("CXU03", {
    expectedRequest:
      "<FSC>K01YZ</FSC><IDS>K21/22T     SINEDIE                 </IDS><SUB>I2576                                                                       26102011V</SUB><CCR>K21/2732/16Z                   </CCR><CCH>K001              TH68006 </CCH><ADJ>INO PLEA TAKENNON-CONVICTION261020110000 </ADJ><DIS>I2063                      00                                                                            </DIS><DIS>I3027    26092011          00                                                                            </DIS><CCH>K002              TH68151 </CCH><ADJ>INO PLEA TAKENNON-CONVICTION261020110000 </ADJ><DIS>I2063                      00                                                                            </DIS><DIS>I3027    26092011          00                                                                            </DIS>",
    count: 1
  })
]
