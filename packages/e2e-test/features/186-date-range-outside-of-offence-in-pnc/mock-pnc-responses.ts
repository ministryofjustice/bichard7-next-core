import { mockEnquiryFromNCM, mockUpdate } from "../../utils/pncMocks"

import type Bichard from "../../utils/world"

export default (ncm: string, world: Bichard) => [
  mockEnquiryFromNCM(ncm, world),
  mockUpdate("CXU02", {
    expectedRequest:
      "<FSC>K01YZ</FSC><IDS>K00/448754K SEXOFFENCE              </IDS><CCR>K97/1626/8395Q                 </CCR><COU>I2732                                                                       SEXOFFENCE/TRPRFOUR                                   260920110000</COU><CCH>K001              SX03001A</CCH><ADJ>INOT GUILTY   GUILTY        260920110000 </ADJ><DIS>I3078                      00                                                                            </DIS><CCH>K002              SX03001 </CCH><ADJ>INOT GUILTY   GUILTY        260920110000 </ADJ><DIS>I3052                      00                                                                            </DIS><CCH>K003              RT88191 </CCH><ADJ>INOT GUILTY   GUILTY        260920110000 </ADJ><DIS>I1015            0000100.0000                                                                            </DIS>"
  })
]
