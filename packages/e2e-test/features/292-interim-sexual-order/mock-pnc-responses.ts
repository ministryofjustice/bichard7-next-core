import type Bichard from "../../utils/world"

export default (ncm: string, { policeApi }: Bichard) => [
  policeApi.mockEnquiryFromNcm(ncm),
  policeApi.mockUpdate("CXU02", {
    expectedRequest:
      "<FSC>K01YZ</FSC><IDS>K00/459617P SEXUALORDER             </IDS><CCR>K97/1626/8395Q                 </CCR><COU>I2576                                                                       SEXUALORDER/INTERIM                                   260920110000</COU><CCH>K001              COML062 </CCH><ADJ>INOT GUILTY   GUILTY        260920110000 </ADJ><DIS>I1015            0000100.0000                                                                            </DIS><DIS>I3281                      00                                                                            </DIS>"
  })
]
