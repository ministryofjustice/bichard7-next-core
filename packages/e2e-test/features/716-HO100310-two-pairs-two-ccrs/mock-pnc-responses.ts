import { mockUpdate } from "../../utils/pncMocks"

export default () => [
  {
    matchRegex: "CXE01",
    response: `<?XML VERSION="1.0" STANDALONE="YES"?>
      <CXE01>
        <GMH>073ENQR000020SENQASIPNCA05A73000017300000120210316152773000001                                             050001772</GMH>
        <ASI>
          <FSC>K01ZD</FSC>
          <IDS>K00/410801G Bass                    </IDS>
          <CCR>K97/1626/8395Q                 </CCR>
          <COF>K001    12:15:24:1   TH68010 250920100000            </COF>
          <COF>K002    12:15:24:1   TH68010 250920100000            </COF>
          <CCR>K97/1626/8396R                 </CCR>
          <COF>K001    12:15:24:1   BG73001 250920120000            </COF>
          <COF>K002    12:15:24:1   BG73001 250920120000            </COF>
        </ASI>
        <GMT>000008073ENQR004540S</GMT>
      </CXE01>`,
    expectedRequest: ""
  },
  mockUpdate("CXU02", {
    count: 1,
    expectedRequest:
      "<FSC>K01YZ</FSC><IDS>K00/410801G BASS                    </IDS><CCR>K97/1626/8395Q                 </CCR><COU>I2576                                                                       BASS/BARRY                                            011020110000</COU><CCH>K001              TH68010 </CCH><ADJ>INOT GUILTY   GUILTY        011020110000 </ADJ><DIS>I1002M12                   00                                                                            </DIS><DIS>I3025Y999                  00            SEA MONKEY                                                      </DIS><CCH>K002              TH68010 </CCH><ADJ>INOT GUILTY   GUILTY        011020110000 </ADJ><DIS>I1002M14                   00                                                                            </DIS><DIS>I3107                      00                                                                            </DIS>"
  }),
  mockUpdate("CXU02", {
    count: 1,
    expectedRequest:
      "<FSC>K01YZ</FSC><IDS>K00/410801G BASS                    </IDS><CCR>K97/1626/8396R                 </CCR><COU>I2576                                                                       BASS/BARRY                                            011020110000</COU><CCH>K001              BG73001 </CCH><ADJ>INOT GUILTY   GUILTY        011020110000 </ADJ><DIS>I1002M12                   00                                                                            </DIS><DIS>I3025Y999                  00            SEA MONKEY                                                      </DIS><CCH>K002              BG73001 </CCH><ADJ>INOT GUILTY   GUILTY        011020110000 </ADJ><DIS>I1002M14                   00                                                                            </DIS><DIS>I3107                      00                                                                            </DIS>"
  })
]
