import { mockEnquiryFromNCM, mockUpdate } from "../../utils/pncMocks"

import type Bichard from "../../utils/world"

export default (ncm: string, world: Bichard) => [
  mockEnquiryFromNCM(ncm, world),
  mockUpdate("CXU02", {
    expectedRequest:
      "<FSC>K01YZ</FSC><IDS>K00/410800F TEARCE                  </IDS><CCR>K97/1626/8395Q                 </CCR><COU>I1910                                                                       TEARCE/WALLACE                                        260920110000</COU><CCH>K001              TH68036 </CCH><ADJ>INOT GUILTY   GUILTY        260920110000 </ADJ><DIS>I1116    26092012          00                                                                            </DIS><DIS>I3105W12                   00BA                                                                          </DIS>"
  })
]
