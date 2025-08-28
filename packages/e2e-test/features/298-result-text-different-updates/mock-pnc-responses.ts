import type Bichard from "../../utils/world"

export default (ncm: string, { policeApi }: Bichard) => [
  policeApi.mockEnquiryFromNcm(ncm),
  policeApi.mockUpdate("CXU02", {
    expectedRequest:
      "<FSC>K01YZ</FSC><IDS>K00/449851Z RESULTTEXTFO            </IDS><CCR>K97/1626/8395Q                 </CCR><COU>I2576                                                                       DUPLICATE/OFFENCES                                    260920110000</COU><CCH>K001              TH68006 </CCH><ADJ>INOT GUILTY   GUILTY        260920110000 </ADJ><DIS>I1015            0000300.0000                                                                            </DIS><DIS>I1016                      00                                                                            </DIS><CCH>K002              TH68006 </CCH><ADJ>INOT GUILTY   GUILTY        260920110000 </ADJ><DIS>I1015            0003000.0000                                                                            </DIS><DIS>I1016                      00                                                                            </DIS>"
  })
]
