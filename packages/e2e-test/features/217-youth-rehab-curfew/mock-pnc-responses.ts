import { mockEnquiryFromNCM, mockUpdate } from "../../utils/pncMocks"

import type Bichard from "../../utils/world"

export default (ncm: string, world: Bichard) => [
  mockEnquiryFromNCM(ncm, world),
  mockUpdate("CXU02", {
    expectedRequest:
      "<FSC>K01YZ</FSC><IDS>K00/440814E REHABORDERS             </IDS><CCR>K97/1626/8395Q                 </CCR><COU>I2576                                                                       REHABORDERS/YOUTH                                     260920110000</COU><CCH>K001              TH68006 </CCH><ADJ>INOT GUILTY   GUILTY        260920110000 </ADJ><DIS>I1141    15072012          00                                                                            </DIS><DIS>I3105M2                    00                                                                            </DIS><CCH>K002              TH68010 </CCH><ADJ>INOT GUILTY   GUILTY        260920110000 </ADJ><DIS>I1141    15072012          00                                                                            </DIS><DIS>I3102D6                    00                                                                            </DIS><CCH>K003              CJ88001 </CCH><ADJ>INOT GUILTY   GUILTY        260920110000 </ADJ><DIS>I1141    15072012          00                                                                            </DIS><DIS>I3105M2                    00                                                                            </DIS><DIS>I3106M3                    00            EXCLUDED FROM NW4 POSTAL AREA.                                  </DIS>"
  })
]
