import { mockEnquiryFromNCM, mockUpdate } from "../../utils/pncMocks"

import type Bichard from "../../utils/world"

export default (ncm: string, world: Bichard) => [
  mockEnquiryFromNCM(ncm, world),
  mockUpdate("CXU02", {
    expectedRequest:
      "<FSC>K01YZ</FSC><IDS>K00/410792X BAKER                   </IDS><CCR>K97/1626/8395Q                 </CCR><COU>I2576                                                                       BAKER/JORDAN                                          250920110000</COU><CCH>K001              RT88191 </CCH><ADJ>INOT GUILTY   GUILTY        250920110000 </ADJ><DIS>I1015            0000045.0000                                                                            </DIS>"
  })
]
