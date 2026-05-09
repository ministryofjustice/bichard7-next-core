import extractAsnFromInputXml from "../../utils/extractAsnFromInputXml"
import type Bichard from "../../utils/world"

export default (_: string, { policeApi }: Bichard) => [
  policeApi.mockAsnQuery({
    matchRegex: "CXE01",
    response: {
      pncCheckName: "BAILY",
      croNumber: "",
      gmh: "073ENQR000712RENQASIPNCA05A73000017300000120210903102473000001                                             050002916",
      gmt: "000008073ENQR000712R",
      personId: "35061a3a-5495-4d80-a6e3-63d92cebad88",
      personUrn: "21/17M",
      reportId: "3a813dc6-1dfd-4ff8-914c-3e4e6ccb085d",
      asn: "1201ZD0100000445098K",
      ownerCode: "01ZD",
      disposals: [
        {
          crimeOffenceReferenceNumber: "",
          courtCaseId: "a33b01ef-8185-4cac-baef-64bcd30dae6e",
          courtCaseReference: "21/2732/000011U",
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
              offenceId: "cfb5498f-029f-4912-9b85-1704449d3b66",
              disposalResults: []
            }
          ]
        }
      ]
    },
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
      remandLocationFfss: "",
      ownerCode: "01YZ",
      personUrn: "21/17M",
      remandDate: "2011-09-26",
      appearanceResult: "remanded-on-bail",
      bailConditions: [
        "EXCLUSION: NOT TO CONTACT DIRECTLY OR INDIRECTLY  ",
        "SOME ONE SAVE VIA A SOLICITOR TO ARRANGE CONTACT  ",
        "WITH CHILD                                        ",
        "                                                  ",
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
    response: {
      pncCheckName: "BAILY",
      croNumber: "",
      gmh: "073ENQR000713RENQASIPNCA05A73000017300000120210903102473000001                                             050002918",
      gmt: "000008073ENQR000713R",
      personId: "f4f3eee9-f39c-4e80-a235-0f8f5d05b571",
      personUrn: "21/17M",
      reportId: "8697263d-9a67-4bb6-83bc-fc9f26eb0360",
      asn: "1201ZD0100000445098K",
      ownerCode: "01ZD",
      disposals: [
        {
          crimeOffenceReferenceNumber: "",
          courtCaseId: "4c8e3350-45a0-4f8f-aac0-b2cec396716e",
          courtCaseReference: "21/2732/000011U",
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
              offenceId: "5775aaea-3e8f-41ef-a4b8-b8afdfd6c30e",
              disposalResults: []
            }
          ]
        }
      ]
    },
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
      remandLocationFfss: "",
      ownerCode: "01YZ",
      personUrn: "21/17M",
      remandDate: "2011-10-26",
      appearanceResult: "remanded-on-bail",
      bailConditions: [
        "EXCLUSION: NOT TO CONTACT DIRECTLY OR INDIRECTLY  ",
        "SOME ONE SAVE VIA A SOLICITOR TO ARRANGE CONTACT  ",
        "WITH CHILD                                        ",
        "                                                  ",
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
