import { mockUpdate } from "../../utils/pncMocks"

export default () => [
  {
    count: 1,
    expectedRequest: "",
    matchRegex: "CXE01",
    response: `<?xml version="1.0" standalone="yes"?>
    <CXE01>
      <GMH>073ENQR000703RENQASIPNCA05A73000017300000120210903102273000001                                             050002896</GMH>
      <ASI>
        <FSC>K01ZD</FSC>
        <IDS>K21/11F     DENIES                  </IDS>
        <CCR>K21/2732/7P                    </CCR>
        <COF>K001    1:8:11:2     CJ88116 28112010                </COF>
      </ASI>
      <GMT>000008073ENQR000703R</GMT>
    </CXE01>`
  },
  mockUpdate("CXU01", {
    count: 1,
    expectedRequest:
      "<FSC>K01YZ</FSC><IDS>K21/11F     DENIES                  </IDS><ASR>K12/01ZD/01/445099L                    </ASR><REM>I26102011B    2576                                                                       261120112576                                                                       EXCLUSION: NOT TO CONTACT DIRECTLY OR INDIRECTLY  SOME ONE SAVE VIA A SOLICITOR TO ARRANGE CONTACT  WITH CHILD                                                                                          EXCLUSION: NOT TO ENTER SOME ROAD OR SOME LANE IN SOME PLACE UNTIL HE HAS ATTENDED IN THE COMPANY OFA POLICE OFICER TO CONFIRM SOME ONE HAS LEFT THE  AREA                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             0000                                                                                                                                                                              </REM>"
  })
]
