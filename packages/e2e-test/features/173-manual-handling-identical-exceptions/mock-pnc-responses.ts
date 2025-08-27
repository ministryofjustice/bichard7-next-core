import type Bichard from "../../utils/world"

export default (ncm: string, { policeApi }: Bichard) => [
  policeApi.mockEnquiryFromNcm(ncm),
  policeApi.mockUpdate("CXU02", {
    expectedRequest:
      "<FSC>K01YZ</FSC><IDS>K00/411423H PINKERTON               </IDS><CCR>K97/1626/8395Q                 </CCR><COU>I2576                                                                       PINKERTON/MARCUS                                      011020110000</COU><CCH>K001              TH68010 </CCH><ADJ>INOT GUILTY   GUILTY        011020110000 </ADJ><DIS>I1002M12                   00                                                                            </DIS><DIS>I1015            0000100.0000                                                                            </DIS><CCH>K002              TH68010 </CCH><ADJ>INOT GUILTY   GUILTY        011020110000 </ADJ><DIS>I1002M12                   00                                                                            </DIS><DIS>I1015            0000300.0000                                                                            </DIS>"
  })
]
