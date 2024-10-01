import { mockEnquiryFromNCM, mockUpdate } from "../../utils/pncMocks"

import type Bichard from "../../utils/world"

export default (ncm: string, world: Bichard) => [
  mockEnquiryFromNCM(ncm, world),
  mockUpdate("CXU02", {
    expectedRequest:
      "<FSC>K01YZ</FSC><IDS>K00/410812U DUCK                    </IDS><CCR>K97/1626/8395Q                 </CCR><COU>I2576                                                                       DUCK/JAMES                                            261020110000</COU><CCH>K001              DD89003 </CCH><ADJ>IGUILTY       GUILTY        261020110000 </ADJ><DIS>I1002W2                    00                                                                            </DIS>"
  })
]
