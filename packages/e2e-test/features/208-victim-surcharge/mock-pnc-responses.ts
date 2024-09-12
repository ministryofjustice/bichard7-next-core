import { mockEnquiryFromNCM, mockUpdate } from "../../utils/pncMocks"

import type Bichard from "../../utils/world"

export default (ncm: string, world: Bichard) => [
  mockEnquiryFromNCM(ncm, world),
  mockUpdate("CXU02", {
    expectedRequest:
      "<FSC>K01YZ</FSC><IDS>K00/356Z    TORRENCE                </IDS><CCR>K97/1626/8395Q                 </CCR><COU>I2576                                                                       TORRENCE/JACK                                         250120090000</COU><CCH>K001              CD71039 </CCH><ADJ>INOT GUILTY   GUILTY        250120090000 </ADJ><DIS>I1015            0000050.0000                                                                            </DIS><DIS>I3011            0000050.0000                                                                            </DIS><DIS>I3011            0000015.0000                                                                            </DIS><DIS>I3117            0000040.0000                                                                            </DIS>"
  })
]
