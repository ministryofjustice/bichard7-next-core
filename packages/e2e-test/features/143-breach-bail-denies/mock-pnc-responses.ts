import extractAsnFromInputXml from "../../utils/extractAsnFromInputXml"
import type Bichard from "../../utils/world"

export default (_: string, { policeApi }: Bichard) => [
  policeApi.mockAsnQuery({
    matchRegex: "CXE01",
    response: {
      pncCheckName: "DENIES",
      croNumber: "",
      gmh: "073ENQR000701RENQASIPNCA05A73000017300000120210903102273000001                                             050002892",
      gmt: "000008073ENQR000701R",
      personId: "76129f8a-9cd7-4fdf-b76c-5636701312a2",
      personUrn: "21/11F",
      reportId: "84bb0627-87aa-40b9-b172-a022b4222a10",
      asn: "1201ZD0100000445099L",
      ownerCode: "01ZD",
      disposals: [
        {
          crimeOffenceReferenceNumber: "",
          courtCaseId: "408076e3-34af-4ef1-a89d-2dda624709fb",
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
              offenceId: "850dac1e-3169-4e02-b1c4-58cf384b766b",
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
      pncCheckName: "DENIES",
      croNumber: "",
      arrestSummonsNumber: "12/01ZD/01/445099L",
      crimeOffenceReferenceNo: "",
      remandLocationFfss: "",
      ownerCode: "01YZ",
      personUrn: "21/11F",
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
      pncCheckName: "DENIES",
      croNumber: "",
      gmh: "073ENQR000702RENQASIPNCA05A73000017300000120210903102273000001                                             050002894",
      gmt: "000008073ENQR000702R",
      personId: "f5363d94-2248-491f-8e61-cf26ddb77273",
      personUrn: "21/11F",
      reportId: "c7611429-c2af-4a7b-8b8d-e7f6e0e93436",
      asn: "1201ZD0100000445099L",
      ownerCode: "01ZD",
      disposals: [
        {
          crimeOffenceReferenceNumber: "",
          courtCaseId: "6268caa4-9bb8-4d90-a851-8ce077619422",
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
              offenceId: "c1279706-68e0-46f4-980e-69adf7ad976d",
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
      pncCheckName: "DENIES",
      croNumber: "",
      arrestSummonsNumber: "12/01ZD/01/445099L",
      crimeOffenceReferenceNo: "",
      remandLocationFfss: "",
      ownerCode: "01YZ",
      personUrn: "21/11F",
      remandDate: "2011-10-10",
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
      pncCheckName: "DENIES",
      croNumber: "",
      gmh: "073ENQR000703RENQASIPNCA05A73000017300000120210903102273000001                                             050002896",
      gmt: "000008073ENQR000703R",
      personId: "4a1ffe3f-e9b9-4a4e-885b-329d6acbd31e",
      personUrn: "21/11F",
      reportId: "e25b4380-e5e3-4811-97a7-2dcf74c29de9",
      asn: "1201ZD0100000445099L",
      ownerCode: "01ZD",
      disposals: [
        {
          crimeOffenceReferenceNumber: "",
          courtCaseId: "8a48be45-05cb-4fdf-bf61-6763a461bfff",
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
              offenceId: "505496f9-432e-4b8a-8be3-697705ef928d",
              disposalResults: []
            }
          ]
        }
      ]
    },
    asn: extractAsnFromInputXml(`${__dirname}/input-message-3.xml`),
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
