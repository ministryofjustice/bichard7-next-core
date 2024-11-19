import type Bichard from "../../utils/world"

import { mockEnquiryFromNCM, mockUpdate } from "../../utils/pncMocks"

export default (ncm: string, world: Bichard) => [
  mockEnquiryFromNCM(ncm, world),
  mockUpdate("CXU02", {
    expectedRequest:
      "<FSC>K01YZ</FSC><IDS>K00/410818A TFILTERONE              </IDS><CCR>K97/1626/8395Q                 </CCR><COU>I2576                                                                       TFILTERONE/TRIGGER                                    280920080000</COU><CCH>K001              TH68023 </CCH><ADJ>INOT GUILTY   GUILTY        280920080000 </ADJ><DIS>I1002M12                   00                                                                            </DIS><DIS>I3047                      00            UNTIL FURTHER ORDER                                             </DIS>"
  })
]
