import { mockEnquiryFromNCM, mockUpdate } from "../../utils/pncMocks"

import type Bichard from "../../utils/world"

export default (ncm: string, world: Bichard) => [
  mockEnquiryFromNCM(ncm, world),
  mockUpdate("CXU02", {
    expectedRequest:
      "<FSC>K01YZ</FSC><IDS>K00/410771Z SVRO                    </IDS><CCR>K97/1626/8395Q                 </CCR><COU>I2576                                                                       SVRO/TRPRTHREEB                                       260920110000</COU><CCH>K001              CD71041 </CCH><ADJ>INOT GUILTY   GUILTY        260920110000 </ADJ><DIS>I3324                      00                                                                            </DIS>"
  })
]
