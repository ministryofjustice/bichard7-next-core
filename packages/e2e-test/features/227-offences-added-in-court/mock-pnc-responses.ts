import extractAsnFromInputXml from "../../utils/extractAsnFromInputXml"
import type Bichard from "../../utils/world"

export default (_: string, { policeApi }: Bichard) => [
  policeApi.mockAsnQuery({
    matchRegex: "CXE01",
    response: {
      pncCheckName: "ADDEDOFFENCE",
      croNumber: "",
      gmh: "073ENQR000716RENQASIPNCA05A73000017300000120210903102473000001                                             050002924",
      gmt: "000008073ENQR000716R",
      personId: "4479d4cf-dc6e-4ca4-8c46-863a6b57f492",
      personUrn: "21/20Q",
      reportId: "360f7ded-666a-4f51-8cab-55f9d5499b8d",
      asn: "1101ZD0100000445115E",
      ownerCode: "01ZD",
      disposals: [
        {
          crimeOffenceReferenceNumber: "",
          courtCaseId: "650c1574-189f-40f3-a0ea-906a39c48285",
          courtCaseReference: "21/2732/000014X",
          caseStatusMarker: "impending-prosecution-detail",
          court: {
            courtIdentityType: "code",
            courtCode: "0000"
          },
          offences: [
            {
              acpoOffenceCode: "5:5:8:1",
              courtOffenceSequenceNumber: 1,
              cjsOffenceCode: "TH68010",
              roleQualifiers: [],
              legislationQualifiers: [],
              offenceTic: 0,
              offenceStartDate: "2010-09-25",
              offenceId: "a020c94d-451d-4348-89f9-32f36ac5e0ec",
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
      pncCheckName: "ADDEDOFFENCE",
      croNumber: "",
      crimeOffenceReferenceNumber: "",
      ownerCode: "01YZ",
      personUrn: "21/20Q",
      courtCaseReference: "21/2732/000014X",
      court: {
        courtIdentityType: "code",
        courtCode: "2576"
      },
      dateOfConviction: "2011-10-01",
      defendant: {
        defendantType: "individual",
        defendantFirstNames: ["PNCADJ"],
        defendantLastName: "ADDEDOFFENCESENTENCETWO"
      },
      offences: [
        {
          courtOffenceSequenceNumber: 1,
          cjsOffenceCode: "TH68010",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-10-01",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 4004,
              disposalEffectiveDate: "2012-01-01"
            }
          ],
          offenceId: "c836e54d-a6f3-42c3-a6e3-e7778ec6762f"
        }
      ]
    },
    count: 1
  }),
  policeApi.mockUpdate("CXU01", {
    expectedRequest: {
      pncCheckName: "ADDEDOFFENCE",
      croNumber: "",
      arrestSummonsNumber: "11/01ZD/01/445115E",
      crimeOffenceReferenceNo: "",
      remandLocationFfss: "",
      ownerCode: "01YZ",
      personUrn: "21/20Q",
      remandDate: "2011-10-01",
      appearanceResult: "remanded-on-bail",
      bailConditions: [],
      currentAppearance: {
        court: {
          courtIdentityType: "code",
          courtCode: "2576"
        }
      },
      nextAppearance: {
        date: "2012-01-01",
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
      pncCheckName: "ADDEDOFFENCE",
      croNumber: "",
      gmh: "073ENQR000717RENQASIPNCA05A73000017300000120210903102473000001                                             050002927",
      gmt: "000010073ENQR000717R",
      personId: "542afb49-9508-40aa-a84d-7ae243e9d97e",
      personUrn: "21/20Q",
      reportId: "ad74d966-04bc-4298-b659-c50740aacb9d",
      asn: "1101ZD0100000445115E",
      ownerCode: "01ZD",
      disposals: [
        {
          crimeOffenceReferenceNumber: "",
          courtCaseId: "70703e55-df02-4bb9-9ea0-231c587706cc",
          courtCaseReference: "21/2732/000014X",
          caseStatusMarker: "impending-prosecution-detail",
          court: {
            courtIdentityType: "code",
            courtCode: "0000"
          },
          offences: [
            {
              acpoOffenceCode: "5:5:8:1",
              courtOffenceSequenceNumber: 1,
              cjsOffenceCode: "TH68010",
              roleQualifiers: [],
              legislationQualifiers: [],
              plea: "Not Guilty",
              offenceTic: 0,
              offenceStartDate: "2010-09-25",
              offenceId: "c3c0a0e8-f426-40e8-b298-2f76c441a273",
              adjudications: [
                {
                  appearanceNumber: 1,
                  adjudicationId: "46b82ff7-4308-46e3-af8d-b1fa250f6580",
                  disposalDate: "2011-10-01",
                  adjudication: "Guilty"
                }
              ],
              disposalResults: [
                {
                  disposalId: "01a229c5-b8e2-4b55-b813-01ae4f404245",
                  disposalCode: 4004,
                  disposalEffectiveDate: "2012-01-01",
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
  })
]
