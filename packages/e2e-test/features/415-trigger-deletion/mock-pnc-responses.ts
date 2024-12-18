import { mockEnquiryFromNCM, mockUpdate } from "../../utils/pncMocks"

import type Bichard from "../../utils/world"

export default (ncm: string, world: Bichard) => [
  mockEnquiryFromNCM(ncm, world, { count: 1 }),
  mockEnquiryFromNCM(ncm.replace("/pnc-data.xml", "/pnc-data-2.xml"), world),
  mockUpdate("CXU02", {
    expectedRequest:
      "<FSC>K01YZ</FSC><IDS>K00/410846F OFFENCE                 </IDS><CCR>K97/1626/8395Q                 </CCR><COU>I2576                                                                       OFFENCE/FUZZY                                         260920110000</COU><CCH>K001              TH68006 </CCH><ADJ>INOT GUILTY   GUILTY        260920110000 </ADJ><DIS>I1016                      00                                                                            </DIS><CCH>K002              TH68151 </CCH><ADJ>INOT GUILTY   GUILTY        260920110000 </ADJ><DIS>I1015            0000100.0000                                                                            </DIS><CCH>K003              RT88191 </CCH><ADJ>INOT GUILTY   GUILTY        260920110000 </ADJ><DIS>I1015            0000200.0000                                                                            </DIS>"
  })
]
