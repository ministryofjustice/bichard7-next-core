import type Bichard from "../../utils/world"

export default (ncm: string, { policeApi }: Bichard) => [
  policeApi.mockEnquiryFromNcm(ncm),
  policeApi.mockUpdate("CXU02", {
    expectedRequest:
      "<FSC>K01YZ</FSC><IDS>K00/410759L TOCONTINUEA             </IDS><CCR>K97/1626/8395Q                 </CCR><COU>I2576                                                                       TOCONTINUEA/ORDER                                     260920110000</COU><CCH>K001              CJ88116 </CCH><ADJ>INOT GUILTY   GUILTY        260920110000 </ADJ><DIS>I1115M4                    00S       M12                                                                 </DIS>",
    count: 1
  })
]
