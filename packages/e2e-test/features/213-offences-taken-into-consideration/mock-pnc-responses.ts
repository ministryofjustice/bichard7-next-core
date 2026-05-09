import extractAsnFromInputXml from "../../utils/extractAsnFromInputXml"
import type Bichard from "../../utils/world"

export default (_: string, { policeApi }: Bichard) => [
  policeApi.mockAsnQuery({
    matchRegex: "CXE01",
    response: {
      pncCheckName: "SENDEF",
      croNumber: "",
      gmh: "073ENQR000330RENQASIPNCA05A73000017300000120210901131673000001                                             050002340",
      gmt: "000008073ENQR000330R",
      personId: "333e03a6-8281-401d-b964-73f267a608a8",
      personUrn: "21/20Q",
      reportId: "78f1f28c-8b5c-4f15-bacb-97469032ce17",
      asn: "1101ZD0100000440811B",
      ownerCode: "01ZD",
      disposals: [
        {
          crimeOffenceReferenceNumber: "",
          courtCaseId: "2cda5590-12f0-42ba-b629-9cc0057f0185",
          courtCaseReference: "21/2732/000015Y",
          caseStatusMarker: "impending-prosecution-detail",
          court: {
            courtIdentityType: "code",
            courtCode: "0000"
          },
          offences: [
            {
              acpoOffenceCode: "5:5:5:1",
              courtOffenceSequenceNumber: 1,
              cjsOffenceCode: "TH68006",
              roleQualifiers: [],
              legislationQualifiers: [],
              offenceTic: 0,
              offenceStartDate: "2011-10-01",
              offenceId: "a8e162c2-08a0-43aa-8df3-1bede3190762",
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
  policeApi.mockUpdate("CXU02", {
    expectedRequest: {
      pncCheckName: "SENDEF",
      croNumber: "",
      crimeOffenceReferenceNumber: "",
      ownerCode: "01YZ",
      personUrn: "21/20Q",
      courtCaseReference: "21/2732/000015Y",
      court: {
        courtIdentityType: "code",
        courtCode: "2576"
      },
      dateOfConviction: "2011-10-26",
      defendant: {
        defendantType: "individual",
        defendantFirstNames: ["TICS"],
        defendantLastName: "SENDEF"
      },
      offences: [
        {
          courtOffenceSequenceNumber: 1,
          cjsOffenceCode: "TH68006",
          plea: "Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-10-26",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 4047,
              disposalEffectiveDate: "2011-10-30"
            }
          ],
          offenceId: "c7762083-e4a0-4006-8abb-bc80b3eeb571"
        }
      ]
    },
    count: 1
  }),
  policeApi.mockUpdate("CXU01", {
    expectedRequest: {
      pncCheckName: "SENDEF",
      croNumber: "",
      arrestSummonsNumber: "11/01ZD/01/440811B",
      crimeOffenceReferenceNo: "",
      remandLocationFfss: "",
      ownerCode: "01YZ",
      personUrn: "21/20Q",
      remandDate: "2011-10-26",
      appearanceResult: "remanded-on-bail",
      bailConditions: [],
      currentAppearance: {
        court: {
          courtIdentityType: "code",
          courtCode: "2576"
        }
      },
      nextAppearance: {
        date: "2011-10-30",
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
      pncCheckName: "SENDEF",
      croNumber: "",
      gmh: "073ENQR000331RENQASIPNCA05A73000017300000120210901131673000001                                             050002343",
      gmt: "000010073ENQR000331R",
      personId: "db3fc58b-7070-4db3-abcd-f243ee08cd65",
      personUrn: "21/20Q",
      reportId: "10e074bf-4fc4-4ea4-8eb7-8c9917512045",
      asn: "1101ZD0100000440811B",
      ownerCode: "01ZD",
      disposals: [
        {
          crimeOffenceReferenceNumber: "",
          courtCaseId: "66c9d169-f015-49dd-a8e2-cae4f9774458",
          courtCaseReference: "21/2732/000015Y",
          caseStatusMarker: "impending-prosecution-detail",
          court: {
            courtIdentityType: "code",
            courtCode: "0000"
          },
          offences: [
            {
              acpoOffenceCode: "5:5:5:1",
              courtOffenceSequenceNumber: 1,
              cjsOffenceCode: "TH68006",
              roleQualifiers: [],
              legislationQualifiers: [],
              plea: "Guilty",
              offenceTic: 0,
              offenceStartDate: "2011-10-01",
              offenceId: "e1af4293-5fd0-4e70-9c78-2097892ccc0b",
              adjudications: [
                {
                  appearanceNumber: 1,
                  adjudicationId: "2dfb31ff-3777-4ee9-a6f4-28a3b3da4e59",
                  disposalDate: "2011-10-26",
                  adjudication: "Guilty"
                }
              ],
              disposalResults: [
                {
                  disposalId: "2b32741c-2654-4512-b74d-116ad635da45",
                  disposalCode: 4047,
                  disposalEffectiveDate: "2011-10-30",
                  disposalText: ""
                }
              ]
            }
          ]
        }
      ]
    },
    asn: extractAsnFromInputXml(`${__dirname}/input-message-2.xml`),
    expectedRequest: "",
    count: 1
  }),
  policeApi.mockUpdate("CXU04", {
    expectedRequest: {
      pncCheckName: "SENDEF",
      croNumber: "",
      crimeOffenceReferenceNumber: "",
      ownerCode: "01YZ",
      personUrn: "21/20Q",
      courtCaseReference: "21/2732/000015Y",
      court: {
        courtIdentityType: "code",
        courtCode: "2576"
      },
      appearanceDate: "2011-10-30",
      reasonForAppearance: "Sentence Deferred",
      offences: [
        {
          courtOffenceSequenceNumber: 1,
          cjsOffenceCode: "TH68006",
          disposalResults: [
            {
              disposalCode: 1116,
              disposalEffectiveDate: "2013-05-17"
            }
          ],
          offenceId: "a776ec27-c3b9-467c-884c-ae21e43d4036"
        }
      ]
    },
    count: 1
  })
]
