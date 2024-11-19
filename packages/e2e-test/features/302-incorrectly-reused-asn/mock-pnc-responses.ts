import { mockUpdate } from "../../utils/pncMocks"

export default () => [
  {
    matchRegex: "CXE01",
    response: `<?xml version="1.0" standalone="yes"?>
    <CXE01>
      <GMH>073ENQR000728RENQASIPNCA05A73000017300000120210903102773000001                                             050002951</GMH>
      <ASI>
        <FSC>K01ZD</FSC>
        <IDS>K21/23U     TWICEBREACHE            </IDS>
        <CCR>K21/2732/17A                   </CCR>
        <COF>K001    8:7:69:3     CJ03510 01102009                </COF>
      </ASI>
      <GMT>000008073ENQR000728R</GMT>
    </CXE01>`,
    expectedRequest: "",
    count: 1
  },
  mockUpdate("CXU02", {
    expectedRequest:
      "<FSC>K01YZ</FSC><IDS>K21/23U     TWICEBREACHE            </IDS><CCR>K21/2732/17A                   </CCR><COU>I2576                                                                       TWICEBREACHED/ASNREUSED                               261020090000</COU><CCH>K001              CJ03510 </CCH><ADJ>INO PLEA TAKENNOT GUILTY    261020090000 </ADJ><DIS>I2006                      00                                                                            </DIS>",
    count: 1
  }),
  {
    matchRegex: "CXE01",
    response: `<?xml version="1.0" standalone="yes"?>
    <CXE01>
      <GMH>073ENQR000729RENQASIPNCA05A73000017300000120210903102773000001                                             050002953</GMH>
      <ASI>
        <FSC>K01ZD</FSC>
        <IDS>K21/23U     TWICEBREACHE            </IDS>
        <CCR>K21/2732/17A                   </CCR>
        <COF>K001    8:7:69:3     CJ03510 01102009                </COF>
        <ADJ>INO PLEA TAKENNOT GUILTY    261020090000 </ADJ>
        <DIS>I2006                                                                                                    </DIS>
      </ASI>
      <GMT>000010073ENQR000729R</GMT>
    </CXE01>`,
    expectedRequest: "",
    count: 2
  }
]
