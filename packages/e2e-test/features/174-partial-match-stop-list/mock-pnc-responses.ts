import { mockEnquiryFromNCM, mockUpdate } from "../../utils/pncMocks"

import type Bichard from "../../utils/world"

export default (ncm: string, world: Bichard) => [
  mockEnquiryFromNCM(ncm, world),
  mockUpdate("CXU02", {
    expectedRequest:
      "<FSC>K01YZ</FSC><IDS>K00/410920L JERICHO                 </IDS><CCR>K97/1626/8395Q                 </CCR><COU>I2576                                                                       JERICHO/MARCUS                                        011020110000</COU><CCH>K001              TH68010 </CCH><ADJ>INOT GUILTY   GUILTY        011020110000 </ADJ><DIS>I1002M12                   00                                                                            </DIS><CCH>K002              TH68010 </CCH><ADJ>INOT GUILTY   GUILTY        011020110000 </ADJ><DIS>I1002M12                   00                                                                            </DIS>"
  })
]
