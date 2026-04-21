import extractAsnFromInputXml from "../../utils/extractAsnFromInputXml"
import type Bichard from "../../utils/world"

export default (_: string, { policeApi }: Bichard) => [
  policeApi.mockAsnQuery({
    matchRegex: "CXE01",
    response: `<?xml version="1.0" standalone="yes"?>
    <CXE01>
      <GMH>073ENQR000712RENQASIPNCA05A73000017300000120210903102473000001                                             050002916</GMH>
      <ASI>
        <FSC>K01ZD</FSC>
        <IDS>K21/17M     BAILY                   </IDS>
        <CCR>K21/2732/11U                   </CCR>
        <COF>K001    1:8:11:2     CJ88116 28112010                </COF>
      </ASI>
      <GMT>000008073ENQR000712R</GMT>
    </CXE01>`,
    asn: extractAsnFromInputXml(`${__dirname}/input-message-1.xml`),
    expectedRequest: "",
    count: 1
  }),
  policeApi.mockUpdate("CXU01", {
    expectedRequest: {
      pncCheckName: "BAILY",
      croNumber: "",
      arrestSummonsNumber: "12/01ZD/01/445098K",
      crimeOffenceReferenceNo: "",
      remandResult: "B",
      remandLocationFfss: "",
      ownerCode: "01YZ",
      personUrn: "21/17M",
      remandDate: "2011-09-26",
      appearanceResult: "remanded-on-bail",
      bailConditions: [
        "EXCLUSION: NOT TO CONTACT DIRECTLY OR INDIRECTLY  ",
        "SOME ONE SAVE VIA A SOLICITOR TO ARRANGE CONTACT  ",
        "WITH CHILD                                        ",
        "EXCLUSION: NOT TO ENTER SOME ROAD OR SOME LANE IN ",
        "SOME PLACE UNTIL HE HAS ATTENDED IN THE COMPANY OF",
        "A POLICE OFICER TO CONFIRM SOME ONE HAS LEFT THE  ",
        "AREA                                              "
      ],
      currentAppearance: {
        court: {
          courtIdentityType: "code",
          courtCode: "2576"
        }
      },
      nextAppearance: {
        date: "2011-10-26",
        court: {
          courtIdentityType: "code",
          courtCode: "2576"
        }
      }
    },
    count: 1
  }),
  policeApi.mockAsnQuery({
    matchRegex: "CXE01",
    response: `<?xml version="1.0" standalone="yes"?>
    <CXE01>
      <GMH>073ENQR000713RENQASIPNCA05A73000017300000120210903102473000001                                             050002918</GMH>
      <ASI>
        <FSC>K01ZD</FSC>
        <IDS>K21/17M     BAILY                   </IDS>
        <CCR>K21/2732/11U                   </CCR>
        <COF>K001    1:8:11:2     CJ88116 28112010                </COF>
      </ASI><GMT>000008073ENQR000713R</GMT>
    </CXE01>`,
    asn: extractAsnFromInputXml(`${__dirname}/input-message-2.xml`),
    expectedRequest: "",
    count: 1
  }),
  policeApi.mockUpdate("CXU01", {
    expectedRequest: {
      pncCheckName: "BAILY",
      croNumber: "",
      arrestSummonsNumber: "12/01ZD/01/445098K",
      crimeOffenceReferenceNo: "",
      remandResult: "B",
      remandLocationFfss: "",
      ownerCode: "01YZ",
      personUrn: "21/17M",
      remandDate: "2011-10-26",
      appearanceResult: "remanded-on-bail",
      bailConditions: [
        "EXCLUSION: NOT TO CONTACT DIRECTLY OR INDIRECTLY  ",
        "SOME ONE SAVE VIA A SOLICITOR TO ARRANGE CONTACT  ",
        "WITH CHILD                                        ",
        "EXCLUSION: NOT TO ENTER SOME ROAD OR SOME LANE IN ",
        "SOME PLACE UNTIL HE HAS ATTENDED IN THE COMPANY OF",
        "A POLICE OFICER TO CONFIRM SOME ONE HAS LEFT THE  ",
        "AREA                                              "
      ],
      currentAppearance: {
        court: {
          courtIdentityType: "code",
          courtCode: "2576"
        }
      },
      nextAppearance: {
        date: "2011-11-26",
        court: {
          courtIdentityType: "code",
          courtCode: "2576"
        }
      }
    },
    count: 1
  })
]
