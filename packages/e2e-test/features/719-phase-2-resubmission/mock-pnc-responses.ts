import { mockEnquiryFromNCM, mockUpdate } from "../../utils/pncMocks"
import type Bichard from "../../utils/world"

export default (ncm: string, world: Bichard) => [
  mockEnquiryFromNCM(ncm, world),
  {
    matchRegex: "CXU02",
    response: `<?xml version="1.0" standalone="yes"?>
    <CXU02>
      <GMH>073ENQR010175EERRASIPNCA05A73000017300000120231120162473000001                                             050018291</GMH>
      <TXT>I1008 - GWAY - ENQUIRY ERROR MORE THAN 3 DISPOSAL GROUPS 09/0000/00/20004H                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  </TXT>
      <GMT>000003073ENQR010175E</GMT>
    </CXU02>`,
    expectedRequest: "",
    count: 1
  },
  mockUpdate("CXU02", {
    expectedRequest:
      "<FSC>K01YZ</FSC><IDS>K00/410780J PUFIVE                  </IDS><CCR>K97/1626/8395Q                 </CCR><COU>I2576                                                                       PUFIVE/UPDATE                                         260920110000</COU><CCH>K001              TH68006 </CCH><ADJ>INOT GUILTY   GUILTY        260920110000 </ADJ><DIS>I1015            0000100.0000                                                                            </DIS><CCH>K002              TH68006 </CCH><ADJ>INOT GUILTY   GUILTY        260920110000 </ADJ><DIS>I1015            0000100.0000                                                                            </DIS><CCH>K003              TH68006 </CCH><ADJ>INOT GUILTY   GUILTY        260920110000 </ADJ><DIS>I1015            0000100.0000                                                                            </DIS>",
    count: 1
  })
]
