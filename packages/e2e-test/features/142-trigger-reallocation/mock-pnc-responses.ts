import { mockEnquiryFromNCM, mockUpdate } from "../../utils/pncMocks"

import type Bichard from "../../utils/world"

export default (ncm: string, world: Bichard) => [
  mockEnquiryFromNCM(ncm, world),
  mockUpdate("CXU02", {
    expectedRequest:
      "<FSC>K36YZ</FSC><IDS>K00/377244A ALLOCATION              </IDS><CCR>K97/1626/8395Q                 </CCR><COU>I1971                                                                       ALLOCATION/TRIGGER                                    260920080000</COU><CCH>K001              TH68006 </CCH><ADJ>INOT GUILTY   GUILTY        260920080000 </ADJ><DIS>I3095M14                   00                                                                            </DIS><CCH>K002              TH68151 </CCH><ADJ>INOT GUILTY   GUILTY        260920080000 </ADJ><DIS>I3052M11                   00                                                                            </DIS><CCH>K003              RT88191 </CCH><ADJ>INOT GUILTY   GUILTY        260920080000 </ADJ><DIS>I3088M12                   00                                                                            </DIS><CCH>K004              TH68006 </CCH><ADJ>INOT GUILTY   GUILTY        260920080000 </ADJ><DIS>I1002M12                   00            IMPRISONMENT FOR 12 MONTHS WITH RESULT TEXT GREATER SIXTY FOURE+</DIS>"
  })
]
