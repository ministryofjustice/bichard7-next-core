import { mockEnquiryFromNCM, mockUpdate } from "../../utils/pncMocks"

import type Bichard from "../../utils/world"

export default (ncm: string, world: Bichard) => [
  { ...mockEnquiryFromNCM(ncm.replace("pnc-data.xml", "pnc-data-1.xml"), world), count: 1 },
  mockUpdate("CXU02", {
    expectedRequest:
      "<FSC>K01YZ</FSC><IDS>K00/448754K SEXOFFENCE              </IDS><CCR>K97/1626/8395Q                 </CCR><COU>I2576                                                                       SEXOFFENCE/TRPRFOUR                                   260920110000</COU><CCH>K001              SX03001A</CCH><ADJ>INOT GUILTY   GUILTY        260920110000 </ADJ><DIS>I3078                      00                                                                            </DIS><CCH>K002              SX03001 </CCH><ADJ>INOT GUILTY   GUILTY        260920110000 </ADJ><DIS>I3052                      00                                                                            </DIS><CCH>K003              RT88191 </CCH><ADJ>INOT GUILTY   GUILTY        260920110000 </ADJ><DIS>I1015            0000100.0000                                                                            </DIS>",
    count: 1
  }),
  { ...mockEnquiryFromNCM(ncm.replace("pnc-data.xml", "pnc-data-2.xml"), world), count: 2 },
  mockUpdate("CXU02", {
    expectedRequest:
      "<FSC>K01YZ</FSC><IDS>K00/410801G BASS                    </IDS><CCR>K97/1626/8395Q                 </CCR><COU>I2576                                                                       BASS/BARRY                                            011020110000</COU><CCH>K001              TH68010 </CCH><ADJ>INOT GUILTY   GUILTY        011020110000 </ADJ><DIS>I1002M12                   00                                                                            </DIS><DIS>I3025Y999                  00            SEA MONKEY                                                      </DIS><CCH>K002              TH68010 </CCH><ADJ>INOT GUILTY   GUILTY        011020110000 </ADJ><DIS>I1002M14                   00                                                                            </DIS><DIS>I3107                      00                                                                            </DIS>",
    count: 1
  })
]
