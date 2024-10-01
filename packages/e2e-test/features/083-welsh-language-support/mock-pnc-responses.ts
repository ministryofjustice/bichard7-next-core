import { mockEnquiryFromNCM, mockUpdate } from "../../utils/pncMocks"

import type Bichard from "../../utils/world"

export default (ncm: string, world: Bichard) => [
  mockEnquiryFromNCM(ncm, world),
  mockUpdate("CXU02", {
    expectedRequest:
      "<FSC>K01YZ</FSC><IDS>K00/410836V LANGUAGE                </IDS><CCR>K97/1626/8395Q                 </CCR><COU>I2576                                                                       LANGUAGE/WELSH                                        260920110000</COU><CCH>K001              TH68006 </CCH><ADJ>INOT GUILTY   GUILTY        260920110000 </ADJ><DIS>I1015            0000200.0000            #,A,A,A,A,E,E,E,E,I,I,I,I,O,O,O,O,U,U,U,U,A,A,A,A,E,E,E,E,I,I,I+</DIS><CCH>K002              TH68151 </CCH><ADJ>INOT GUILTY   GUILTY        260920110000 </ADJ><DIS>I1015            0000200.0000                                                                            </DIS><CCH>K003              RT88191 </CCH><ADJ>INOT GUILTY   GUILTY        260920110000 </ADJ><DIS>I1015            0000300.0000                                                                            </DIS><ASR>K11/01ZD/01/410836V                    </ASR><ACH>I                                                                                                                                            TH68006                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     NKINGSTON HIGH STREET                                                                                                                                                                                                                   01ZD29112010                </ACH><ADJ>INOT GUILTY   GUILTY        260920110000 </ADJ><DIS>I1015            0000400.0000            #,A,A,A,A,E,E,E,E,I,I,I,I,O,O,O,O,U,U,U,U,A,A,A,A,E,E,E,E,I,I,I+</DIS><ACH>I                                                                                                                                            RT88026                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     NKINGSTON HIGH STREET                                                                                                                                                                                                                   01ZD28112010                </ACH><ADJ>INOT GUILTY   GUILTY        260920110000 </ADJ><DIS>I1015            0000500.0000                                                                            </DIS>"
  })
]