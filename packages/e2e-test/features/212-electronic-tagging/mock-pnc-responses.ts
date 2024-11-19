import { mockEnquiryFromNCM, mockUpdate } from "../../utils/pncMocks"

import type Bichard from "../../utils/world"

export default (ncm: string, world: Bichard) => [
  mockEnquiryFromNCM(ncm, world),
  mockUpdate("CXU02", {
    expectedRequest:
      "<FSC>K01YZ</FSC><IDS>K00/440808Y MORETHANONEO            </IDS><CCR>K97/1626/8395Q                 </CCR><COU>I2576                                                                       MORETHANONEOFFENCE/TAGGING                            260920110000</COU><CCH>K001              PL96001 </CCH><ADJ>INO PLEA TAKENGUILTY        260920110000 </ADJ><DIS>I1115M3                    00C S     M12                                                                 </DIS><DIS>I3105M2                    00BA                                                                          </DIS><CCH>K002              PL96002 </CCH><ADJ>INO PLEA TAKENGUILTY        260920110000 </ADJ><DIS>I1115M3                    00C S     M12                                                                 </DIS><DIS>I3105M2                    00BA                                                                          </DIS><CCH>K003              PL96004 </CCH><ADJ>INO PLEA TAKENGUILTY        260920110000 </ADJ><DIS>I1115D14                   00C S     M12                                                                 </DIS><DIS>I3105M2                    00BA                                                                          </DIS>"
  })
]
