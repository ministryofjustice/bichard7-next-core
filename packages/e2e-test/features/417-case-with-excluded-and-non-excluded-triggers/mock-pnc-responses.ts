import extractAsnFromInputXml from "../../utils/extractAsnFromInputXml"
import type Bichard from "../../utils/world"

export default (_: string, { policeApi }: Bichard) => [
  policeApi.mockAsnQuery({
    matchRegex: "CXE01",
    response: {
      pncCheckName: "DENIES",
      croNumber: "",
      gmh: "073ENQR000703RENQASIPNCA05A73000017300000120210903102273000001                                             050002896",
      gmt: "000008073ENQR000703R",
      personId: "9d525940-a102-426d-83a1-78a08f4d7f6f",
      personUrn: "21/11F",
      reportId: "8b2c276e-cab5-43c4-a5ae-bdcc36b2320d",
      asn: "1201ZD0100000445099L",
      ownerCode: "01ZD",
      disposals: [
        {
          crimeOffenceReferenceNumber: "",
          courtCaseId: "c0d59348-6d2f-4b09-ace9-5ffd42803a28",
          courtCaseReference: "21/2732/000007P",
          caseStatusMarker: "impending-prosecution-detail",
          court: {
            courtIdentityType: "code",
            courtCode: "0000"
          },
          offences: [
            {
              acpoOffenceCode: "1:8:11:2",
              courtOffenceSequenceNumber: 1,
              cjsOffenceCode: "CJ88116",
              roleQualifiers: [],
              legislationQualifiers: [],
              offenceTic: 0,
              offenceStartDate: "2010-11-28",
              offenceId: "ecbc0e18-769c-47c8-84ae-c873e7466f81",
              disposalResults: []
            }
          ]
        }
      ]
    },
    asn: extractAsnFromInputXml(`${__dirname}/input-message.xml`),
    expectedRequest: "",
    count: 1
  }),
  policeApi.mockUpdate("CXU01", {
    expectedRequest: {
      pncCheckName: "DENIES",
      croNumber: "",
      arrestSummonsNumber: "12/01ZD/01/445099L",
      crimeOffenceReferenceNo: "",
      remandLocationFfss: "",
      ownerCode: "01YZ",
      personUrn: "21/11F",
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
