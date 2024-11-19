import type Bichard from "../../utils/world"

import { mockEnquiryFromNCM, mockUpdate } from "../../utils/pncMocks"

export default (ncm: string, world: Bichard) => [
  mockEnquiryFromNCM(ncm, world),
  mockUpdate("CXU02", {
    expectedRequest:
      "<FSC>K01YZ</FSC><IDS>K00/410847G MISMATCH                </IDS><CCR>K97/1626/8395Q                 </CCR><COU>I2576                                                                       MISMATCH/OFFENCE                                      260920110000</COU><CCH>K001              TH68006 </CCH><ADJ>INOT GUILTY   GUILTY        260920110000 </ADJ><DIS>I1016                      00                                                                            </DIS><CCH>K002              TH68151 </CCH><ADJ>INOT GUILTY   GUILTY        260920110000 </ADJ><DIS>I1015            0000100.0000                                                                            </DIS><CCH>K003              RT88191 </CCH><ADJ>INOT GUILTY   GUILTY        260920110000 </ADJ><DIS>I1015            0000200.0000                                                                            </DIS><ASR>K11/01ZD/01/410847G                    </ASR><ACH>I                                                                                                                                            TH68006                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     NKINGSTON HIGH STREET                                                                                                                                                                                                                   01ZD29112010    05122010    </ACH><ADJ>INOT GUILTY   GUILTY        260920110000 </ADJ><DIS>I1015            0000300.0000                                                                            </DIS><ACH>I                                                                                                                                            RT88026                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     NKINGSTON HIGH STREET                                                                                                                                                                                                                   01ZD28112010    05122010    </ACH><ADJ>INOT GUILTY   GUILTY        260920110000 </ADJ><DIS>I1015            0000300.0000                                                                            </DIS>"
  })
]
