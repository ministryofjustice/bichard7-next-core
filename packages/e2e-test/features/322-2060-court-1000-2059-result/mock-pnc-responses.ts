import { mockEnquiryFromNCM, mockUpdate } from "../../utils/pncMocks"

import type Bichard from "../../utils/world"

export default (ncm: string, world: Bichard) => [
  mockEnquiryFromNCM(ncm, world),
  mockUpdate("CXU01", {
    expectedRequest:
      "<FSC>K01YZ</FSC><IDS>K00/500016E TWOZEROSIXZE            </IDS><ASR>K11/01ZD/01/500016E                    </ASR><REM>I26092011B    2576                                                                       081020112576                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      0000                                                                                                                                                                              </REM>"
  }),
  mockUpdate("CXU02", {
    expectedRequest:
      "<FSC>K01YZ</FSC><IDS>K00/500016E TWOZEROSIXZE            </IDS><CCR>K97/1626/8395Q                 </CCR><COU>I2576                                                                       TWOZEROSIXZERO/PNCUPDATE                              260920110000</COU><CRT>I2576                                                                       08102011</CRT><CCH>K001              TH68006 </CCH><ADJ>INOT GUILTY   NON-CONVICTION260920110000 </ADJ><DIS>I2063                      00                                                                            </DIS><ASR>K11/01ZD/01/500016E                    </ASR><ACH>I                                                                                                                                            TH68151                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     NKINGSTON HIGH STREET                                                                                                                                                                                                                   01ZD28112010                </ACH><ADJ>INOT GUILTY                         0000 </ADJ><DIS>I2059                      00                                                                            </DIS>"
  })
]
