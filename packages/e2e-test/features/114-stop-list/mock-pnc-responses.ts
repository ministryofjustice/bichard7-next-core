import { mockEnquiryFromNCM, mockUpdate } from "../../utils/pncMocks"

import type Bichard from "../../utils/world"

export default (ncm: string, world: Bichard) => [
  mockEnquiryFromNCM(ncm, world),
  mockUpdate("CXU02", {
    expectedRequest:
      "<FSC>K01YZ</FSC><IDS>K00/410850K QUALIFIERS              </IDS><CCR>K97/1626/8395Q                 </CCR><COU>I2576                                                                       QUALIFIERS/RESULTCODE                                 260920110000</COU><CCH>K001              TH68006 </CCH><ADJ>INOT GUILTY   GUILTY        260920110000 </ADJ><DIS>I1002M12                   00F                                                                           </DIS><DIS>I1081M12                   00F                                                                           </DIS><CCH>K002              TH68151 </CCH><ADJ>INOT GUILTY   GUILTY        260920110000 </ADJ><DIS>I1002M10                   00F                                                                           </DIS><DIS>I1081M10                   00F                                                                           </DIS>"
  })
]
