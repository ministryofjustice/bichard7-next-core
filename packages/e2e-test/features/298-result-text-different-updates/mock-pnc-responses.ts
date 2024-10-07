import { mockEnquiryFromNCM, mockUpdate } from "../../utils/pncMocks"

import type Bichard from "../../utils/world"

export default (ncm: string, world: Bichard) => [
  mockEnquiryFromNCM(ncm, world),
  mockUpdate("CXU02", {
    expectedRequest:
      "<FSC>K01YZ</FSC><IDS>K00/449851Z RESULTTEXTFO            </IDS><CCR>K97/1626/8395Q                 </CCR><COU>I2576                                                                       RESULTTEXTFORCED/DUPLICATEOFFENCES                    260920110000</COU><CCH>K001              TH68006 </CCH><ADJ>INOT GUILTY   GUILTY        260920110000 </ADJ><DIS>I1015            0000300.0000            FORCED RESULT TEXT FROM PORTAL OFF1.                            </DIS><DIS>I1016                      00            BOUND OVER.                                                     </DIS><CCH>K002              TH68006 </CCH><ADJ>INOT GUILTY   GUILTY        260920110000 </ADJ><DIS>I1015            0003000.0000            FORCED RESULT TEXT FROM PORTAL OFF2                             </DIS><DIS>I1016                      00            BOUND OVER SOMETHING SOMETHING.                                 </DIS>"
  })
]
