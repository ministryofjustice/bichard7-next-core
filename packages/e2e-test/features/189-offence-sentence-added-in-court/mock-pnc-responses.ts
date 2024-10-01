import { mockUpdate } from "../../utils/pncMocks"

export default () => [
  {
    matchRegex: "CXE01",
    response: `<?xml version="1.0" standalone="yes"?>
    <CXE01>
      <GMH>073ENQR000324RENQASIPNCA05A73000017300000120210901130673000001                                             050002326</GMH>
      <ASI>
        <FSC>K01ZD</FSC>
        <IDS>K21/15K     HARLOW                  </IDS>
        <CCR>K21/2732/12V                   </CCR>
        <COF>K001    5:5:8:1      TH68010 25092010                </COF>
      </ASI>
      <GMT>000008073ENQR000324R</GMT>
    </CXE01>`,
    expectedRequest: "",
    count: 1
  },
  mockUpdate("CXU02", {
    expectedRequest:
      "<FSC>K01YZ</FSC><IDS>K21/15K     HARLOW                  </IDS><CCR>K21/2732/12V                   </CCR><COU>I2576                                                                       HARLOW/ALAN                                           011020110000</COU><CCH>K001              TH68010 </CCH><ADJ>INOT GUILTY   GUILTY        011020110000 </ADJ><DIS>I4004    01022012          00                                                                            </DIS>",
    count: 1
  }),
  mockUpdate("CXU01", {
    expectedRequest:
      "<FSC>K01YZ</FSC><IDS>K21/15K     HARLOW                  </IDS><ASR>K11/01ZD/01/410871H                    </ASR><REM>I01102011B    2576                                                                       010220122576                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      0000                                                                                                                                                                              </REM>",
    count: 1
  }),
  {
    matchRegex: "CXE01",
    response: `<?xml version="1.0" standalone="yes"?>
    <CXE01>
      <GMH>073ENQR000325RENQASIPNCA05A73000017300000120210901130673000001                                             050002329</GMH>
      <ASI>
        <FSC>K01ZD</FSC>
        <IDS>K21/15K     HARLOW                  </IDS>
        <CCR>K21/2732/12V                   </CCR>
        <COF>K001    5:5:8:1      TH68010 25092010                </COF>
        <ADJ>INOT GUILTY   GUILTY        011020110000 </ADJ>
        <DIS>I4004    01022012                                                                                        </DIS>
      </ASI><GMT>000010073ENQR000325R</GMT>
    </CXE01>`,
    expectedRequest: "",
    count: 1
  },
  mockUpdate("CXU04", {
    expectedRequest:
      "<FSC>K01YZ</FSC><IDS>K21/15K     HARLOW                  </IDS><SUB>I2576                                                                       01122011D</SUB><CCR>K21/2732/12V                   </CCR><CCH>K001              TH68010 </CCH><DIS>I1002M12                   00                                                                            </DIS>",
    count: 1
  })
]
