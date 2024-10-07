import { mockUpdate } from "../../utils/pncMocks"

export default () => [
  {
    matchRegex: "CXE01",
    response: `<?xml version="1.0" standalone="yes"?>
    <CXE01>
      <GMH>073ENQR000137RENQASIPNCA05A73000017300000120210827102873000001                                             050002039</GMH>
      <ASI>
        <FSC>K01VK</FSC>
        <IDS>K09/479G    MARTIN                  </IDS>
        <CCR>K09/0428/446G                  </CCR>
        <COF>K001    3:1:1:1      CD71015 01062009                </COF>
        <CCR>K09/0413/447K                  </CCR>
        <COF>K001    5:3:7:1      TH68037 01062009                </COF>
        <CCR>K09/0418/448U                  </CCR>
        <COF>K001    5:6:1:1      TH68072 01062009                </COF>
        <COF>K002    5:8:1:1      TH68081 01062009                </COF>
      </ASI>
      <GMT>000013073ENQR000137R</GMT>
    </CXE01>`,
    expectedRequest: "",
    count: 1
  },
  mockUpdate("CXU02", {
    expectedRequest:
      "<FSC>K01YZ</FSC><IDS>K09/479G    MARTIN                  </IDS><CCR>K09/0413/447K                  </CCR><COU>I2576                                                                       MARTIN/ROGER                                          011020090000</COU><CCH>K001              TH68037 </CCH><ADJ>INOT GUILTY   GUILTY        011020090000 </ADJ><DIS>I4011    01112009          00                                                                            </DIS>",
    count: 1
  }),
  mockUpdate("CXU01", {
    expectedRequest:
      "<FSC>K01YZ</FSC><IDS>K09/479G    MARTIN                  </IDS><ASR>K09/0000/00/20003G                     </ASR><REM>I01102009B    2576                                                                       011120092576                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      0000                                                                                                                                                                              </REM>",
    count: 1
  }),
  {
    matchRegex: "CXE01",
    response: `<?xml version="1.0" standalone="yes"?>
    <CXE01>
      <GMH>073ENQR000138RENQASIPNCA05A73000017300000120210827102873000001                                             050002042</GMH>
      <ASI>
        <FSC>K01VK</FSC>
        <IDS>K09/479G    MARTIN                  </IDS>
        <CCR>K09/0428/446G                  </CCR>
        <COF>K001    3:1:1:1      CD71015 01062009                </COF>
        <CCR>K09/0413/447K                  </CCR>
        <COF>K001    5:3:7:1      TH68037 01062009                </COF>
        <ADJ>INOT GUILTY   GUILTY        011020090000 </ADJ>
        <DIS>I4011    01112009                                                                                        </DIS>
        <CCR>K09/0418/448U                  </CCR>
        <COF>K001    5:6:1:1      TH68072 01062009                </COF>
        <COF>K002    5:8:1:1      TH68081 01062009                </COF>
      </ASI>
      <GMT>000015073ENQR000138R</GMT>
    </CXE01>`,
    expectedRequest: "",
    count: 1
  },
  mockUpdate("CXU04", {
    expectedRequest:
      "<FSC>K01YZ</FSC><IDS>K09/479G    MARTIN                  </IDS><SUB>I2576                                                                       01112009D</SUB><CCR>K09/0413/447K                  </CCR><CCH>K001              TH68037 </CCH><DIS>I1002M12                   00                                                                            </DIS>",
    count: 1
  }),
  mockUpdate("CXU01", {
    expectedRequest:
      "<FSC>K01YZ</FSC><IDS>K09/479G    MARTIN                  </IDS><ASR>K09/0000/00/20003G                     </ASR><REM>I01112009B    2576                                                                       011220092576                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      0000                                                                                                                                                                              </REM>",
    count: 1
  })
]
