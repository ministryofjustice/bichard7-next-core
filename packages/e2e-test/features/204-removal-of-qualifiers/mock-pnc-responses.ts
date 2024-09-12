import { mockEnquiryFromNCM, mockUpdate } from "../../utils/pncMocks"

import type Bichard from "../../utils/world"

export default (ncm: string, world: Bichard) => [
  mockEnquiryFromNCM(ncm, world),
  mockUpdate("CXU02", {
    expectedRequest:
      "<FSC>K01YZ</FSC><IDS>K00/378Y    DUFRESNE                </IDS><CCR>K97/1626/8395Q                 </CCR><COU>I2576                                                                       DUFRESNE/ANDY                                         260920080000</COU><CCH>K001              TH68006 </CCH><ADJ>INOT GUILTY   GUILTY        260920080000 </ADJ><DIS>I4027    01102008          00BA                                                                          </DIS>"
  })
]
