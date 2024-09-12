import { mockEnquiryFromNCM, mockUpdate } from "../../utils/pncMocks"

import type Bichard from "../../utils/world"

export default (ncm: string, world: Bichard) => [
  mockEnquiryFromNCM(ncm, world),
  mockUpdate("CXU02", {
    expectedRequest:
      "<FSC>K01YZ</FSC><IDS>K00/415364R CIRCLUS                 </IDS><CCR>K97/1626/8395Q                 </CCR><COU>I2576                                                                       CIRCLUS/THETUBE                                       260920110000</COU><CCH>K001              TH68006 </CCH><ADJ>INO PLEA TAKENNON-CONVICTION260920110000 </ADJ><DIS>I4010                      00                                                                            </DIS>"
  })
]
