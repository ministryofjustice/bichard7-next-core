import { mockUpdate } from "../../utils/pncMocks"

export default () => [
  {
    matchRegex: "CXE01",
    response: `<?XML VERSION="1.0" STANDALONE="YES"?>
    <CXE01>
      <GMH>073ENQR000020SENQASIPNCA05A73000017300000120210316152773000001                                             050001772</GMH>
      <ASI>
        <FSC>K01ZD</FSC>
        <IDS>K13/4B      WILLIAMS                </IDS>
        <PCR>K01ZD/1234/09       </PCR>
        <COF>K001    12:21:5:1    CJ67002 01062009                </COF>
        <DIS>I1109000C 80.00                                                                                          </DIS>
      </ASI>
      <GMT>000008073ENQR004540S</GMT>
    </CXE01>`,
    expectedRequest: ""
  },
  mockUpdate("CXU07", {
    expectedRequest:
      "<FSC>K01YZ</FSC><IDS>K13/4B      WILLIAMS                </IDS><SUB>I2576                                                                       26112009P</SUB><PCR>K01ZD/1234/09                      </PCR><CCH>K001              CJ67002 </CCH><ADJ>INOT GUILTY   GUILTY        261120090000 </ADJ><DIS>I1015            0000100.0000                                                                            </DIS>"
  })
]
