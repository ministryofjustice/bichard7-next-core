import { mockEnquiryFromNCM, mockUpdate } from "../../utils/pncMocks"

import type Bichard from "../../utils/world"

export default (ncm: string, world: Bichard) => [
  mockEnquiryFromNCM(ncm, world),
  mockUpdate("CXU02", {
    expectedRequest:
      "<FSC>K01YZ</FSC><IDS>K00/410789U BETHEL                  </IDS><CCR>K97/1626/8395Q                 </CCR><COU>I2576                                                                       BETHEL/BARRY                                          250120110000</COU><CCH>K001              TH68006 </CCH><ADJ>INOT GUILTY   GUILTY        250120110005 </ADJ><DIS>I1015            0000100.0000                                                                            </DIS><CCH>K002              TH68151 </CCH><ADJ>INOT GUILTY   GUILTY        250120110015 </ADJ><DIS>I1002M12                   00                                                                            </DIS><CCH>K003              RT88191 </CCH><ADJ>INOT GUILTY   GUILTY        250120110000 </ADJ><DIS>I1015            0000100.0000                                                                            </DIS>"
  })
]
