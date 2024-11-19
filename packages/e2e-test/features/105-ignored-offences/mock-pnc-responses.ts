import { mockEnquiryFromNCM, mockUpdate } from "../../utils/pncMocks"

import type Bichard from "../../utils/world"

export default (ncm: string, world: Bichard) => [
  mockEnquiryFromNCM(ncm, world),
  mockUpdate("CXU02", {
    expectedRequest:
      "<FSC>K01YZ</FSC><IDS>K00/410844D SOMEOFFENCES            </IDS><CCR>K97/1626/8395Q                 </CCR><COU>I2576                                                                       SOMEOFFENCES/IGNORE                                   011020110000</COU><CCH>K001              TH68010 </CCH><ADJ>INOT GUILTY   GUILTY        011020110000 </ADJ><DIS>I1002M12                   00                                                                            </DIS><CCH>K002              TH68012 </CCH><ADJ>INOT GUILTY   GUILTY        011020110000 </ADJ><DIS>I1002M14                   00                                                                            </DIS><DIS>I3107                      00                                                                            </DIS>"
  })
]
