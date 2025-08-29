import type Bichard from "../../utils/world"

export default (ncm: string, { policeApi }: Bichard) => [
  policeApi.mockEnquiryFromNcm(ncm),
  policeApi.mockUpdate("CXU02", {
    expectedRequest:
      "<FSC>K01YZ</FSC><IDS>K00/415362P NORTHERS                </IDS><CCR>K97/1626/8395Q                 </CCR><COU>I2576                                                                       NORTHERS/THETUBE                                      261020110000</COU><CCH>K001              CJ03510 </CCH><ADJ>IGUILTY       GUILTY        261020110000 </ADJ><DIS>I1015            0000100.0000                                                                            </DIS>"
  })
]
