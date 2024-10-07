import { mockEnquiryFromNCM, mockUpdate } from "../../utils/pncMocks"

import type Bichard from "../../utils/world"

export default (ncm: string, world: Bichard) => [
  mockEnquiryFromNCM(ncm, world),
  mockUpdate("CXU02", {
    expectedRequest:
      "<FSC>K01YZ</FSC><IDS>K00/449849X RESULTTEXTIS            </IDS><CCR>K97/1626/8395Q                 </CCR><COU>I2576                                                                       RESULTTEXTISNTUSED/DUPLICATEOFFENCES                  260920110000</COU><CCH>K001              TH68006 </CCH><ADJ>INOT GUILTY   GUILTY        260920110000 </ADJ><DIS>I1015            0000300.0000                                                                            </DIS><DIS>I1016                      00                                                                            </DIS><CCH>K002              TH68006 </CCH><ADJ>INOT GUILTY   GUILTY        260920110000 </ADJ><DIS>I1015            0000300.0000                                                                            </DIS><DIS>I1016                      00                                                                            </DIS>"
  })
]
