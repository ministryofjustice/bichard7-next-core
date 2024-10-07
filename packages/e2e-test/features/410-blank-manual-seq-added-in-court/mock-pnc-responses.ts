import { mockEnquiryFromNCM, mockUpdate } from "../../utils/pncMocks"

import type Bichard from "../../utils/world"

export default (ncm: string, world: Bichard) => [
  mockEnquiryFromNCM(ncm, world),
  mockUpdate("CXU02", {
    expectedRequest:
      "<FSC>K01YZ</FSC><IDS>K00/449852A RESULTTEXTIS            </IDS><CCR>K97/1626/8395Q                 </CCR><COU>I2576                                                                       RESULTTEXTISUSED/DUPLICATEOFFENCEADDEDINCOURT         260920110000</COU><CCH>K001              TH68006 </CCH><ADJ>INOT GUILTY   GUILTY        260920110000 </ADJ><DIS>I1100W6                    00BA          EXCLUDED FROM ALL LICENSED PREMISES WITHIN DIDLY DISTRICT COUNC+</DIS><DIS>I3041M12                   00            EXCLUDED FROM SEAWORLD PUBLIC HOUSE, SEAWORLD, PICKERING, NORTH+</DIS><ASR>K14/01ZD/01/449852A                    </ASR><ACH>I                                                                                                                                            TH68006                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     NKINGSTON HIGH STREET                                                                                                                                                                                                                   01ZD28112010                </ACH><ADJ>INOT GUILTY   GUILTY        260920110000 </ADJ><DIS>I1100W6                    00BA          EXCLUDED FROM ALL LICENSED PREMISES WITHIN IDLY DISTRICT COUNCI+</DIS><DIS>I3041M12                   00            EXCLUDED FROM LANDWORLD PUBLIC HOUSE, LANDWORLD, PICKERING, NOR+</DIS>"
  })
]