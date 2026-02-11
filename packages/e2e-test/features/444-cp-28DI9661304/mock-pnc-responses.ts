import type Bichard from "../../utils/world"

export default (ncm: string, { policeApi }: Bichard) => [
  policeApi.mockEnquiryFromNcm(ncm),
  policeApi.mockUpdate("CXU02", {
    matchRegex: "CXU02.*SX03001A",
    count: 1,
    expectedRequest:
      "<FSC>K04YZ</FSC><IDS>K12/14X     AVALON                  </IDS><CCR>K12/2732/16T                   </CCR><COU>I2576                                                                       AVALON/MARTIN                                         011020090000</COU><CCH>K002              OF61016 </CCH><ADJ>INOT GUILTY   GUILTY        011020090000 </ADJ><DIS>I1002M11                   00                                                                            </DIS><CCH>K001              SX03001A</CCH><ADJ>INOT GUILTY   GUILTY        011020090000 </ADJ><DIS>I1002M12                   00                                                                            </DIS>"
  }),
  policeApi.mockUpdate("CXU02", {
    matchRegex: "CXU02.*I1002M10",
    count: 1,
    expectedRequest:
      "<FSC>K04YZ</FSC><IDS>K12/14X     AVALON                  </IDS><CCR>K12/2732/15R                   </CCR><COU>I2576                                                                       AVALON/MARTIN                                         011020090000</COU><CCH>K001              OF61016 </CCH><ADJ>INOT GUILTY   GUILTY        011020090000 </ADJ><DIS>I1002M10                   00                                                                            </DIS><DIS>I1002M12                   00                                                                            </DIS>"
  })
]
