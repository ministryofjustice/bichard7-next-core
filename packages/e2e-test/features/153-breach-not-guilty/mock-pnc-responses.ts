import { mockEnquiryFromNCM, mockUpdate } from "../../utils/pncMocks"

import type Bichard from "../../utils/world"

export default (ncm: string, world: Bichard) => [
  mockEnquiryFromNCM(ncm, world),
  mockUpdate("CXU02", {
    expectedRequest:
      "<FSC>K01YZ</FSC><IDS>K00/410756H FINCHXX                 </IDS><CCR>K97/1626/8395Q                 </CCR><COU>I2576                                                                       FINCHXX/MARK                                          261020110000</COU><CCH>K001              CJ03510 </CCH><ADJ>INO PLEA TAKENNOT GUILTY    261020110000 </ADJ><DIS>I2004                      00                                                                            </DIS>"
  })
]
