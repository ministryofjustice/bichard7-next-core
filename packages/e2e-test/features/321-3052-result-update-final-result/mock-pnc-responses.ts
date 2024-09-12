import { mockEnquiryFromNCM, mockUpdate } from "../../utils/pncMocks"

import type Bichard from "../../utils/world"

export default (ncm: string, world: Bichard) => [
  mockEnquiryFromNCM(ncm, world),
  mockUpdate("CXU02", {
    expectedRequest:
      "<FSC>K01YZ</FSC><IDS>K00/500010Y THREEZEROFIV            </IDS><CCR>K97/1626/8395Q                 </CCR><COU>I2576                                                                       THREEZEROFIVETWO/JUDGEFINAL                           260920110000</COU><CCH>K001              TH68006 </CCH><ADJ>INOT GUILTY   GUILTY        260920110000 </ADJ><DIS>I1002M12                   00                                                                            </DIS><DIS>I3052M12                   00                                                                            </DIS>"
  })
]
