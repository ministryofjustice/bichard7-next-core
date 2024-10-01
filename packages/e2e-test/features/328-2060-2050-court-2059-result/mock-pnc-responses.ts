import { mockEnquiryFromNCM, mockUpdate } from "../../utils/pncMocks"

import type Bichard from "../../utils/world"

export default (ncm: string, world: Bichard) => [
  mockEnquiryFromNCM(ncm, world),
  mockUpdate("CXU01", {
    expectedRequest:
      "<FSC>K01YZ</FSC><IDS>K00/500015D TWOZEROFIVEN            </IDS><ASR>K11/01ZD/01/500015D                    </ASR><REM>I26092011B    2576                                                                       081020112576                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      0000                                                                                                                                                                              </REM>"
  }),
  mockUpdate("CXU02", {
    expectedRequest:
      "<FSC>K01YZ</FSC><IDS>K00/500015D TWOZEROFIVEN            </IDS><CCR>K97/1626/8395Q                 </CCR><COU>I2576                                                                       TWOZEROFIVENINE/ELLIOTT                               260920110000</COU><RCC>I01ZD/0300108                                                                       </RCC><CRT>I2576                                                                       08102011</CRT><CCH>K001              TH68006 </CCH><ADJ>I                                   0000 </ADJ><DIS>I2060                      00                                                                            </DIS><CCH>K002              TH68151 </CCH><ADJ>INOT GUILTY   GUILTY        260920110000 </ADJ><DIS>I4004    08102011          00                                                                            </DIS><ASR>K11/01ZD/01/500015D                    </ASR><ACH>I                                                                                                                                            RT88191                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     NKINGSTON HIGH STREET                                                                                                                                                                                                                   01ZD28112010                </ACH><ADJ>INOT GUILTY                         0000 </ADJ><DIS>I2059                      00                                                                            </DIS>"
  })
]