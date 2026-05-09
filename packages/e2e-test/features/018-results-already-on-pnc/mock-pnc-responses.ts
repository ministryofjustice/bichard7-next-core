import extractAsnFromInputXml from "../../utils/extractAsnFromInputXml"
import type Bichard from "../../utils/world"

export default (_: string, { policeApi }: Bichard) => [
  policeApi.mockAsnQuery({
    matchRegex: "CXE01",
    response: {
      pncCheckName: "NXONE",
      croNumber: "",
      gmh: "073ENQR000687RENQASIPNCA05A73000017300000120210903101273000001                                             050002861",
      gmt: "000008073ENQR000687R",
      personId: "4d8ba856-2e55-4647-b41d-575b2060107a",
      personUrn: "21/1V",
      reportId: "6c05b762-a122-4850-ab6c-551e6b658f77",
      asn: "1101ZD0100000410779H",
      ownerCode: "01ZD",
      disposals: [
        {
          crimeOffenceReferenceNumber: "",
          courtCaseId: "3edb7023-43b5-44d0-8ba4-d519961f4e26",
          courtCaseReference: "21/2732/000001H",
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
              offenceStartDate: "2010-11-28",
              offenceId: "7289de87-163c-46de-9630-0d13e7bb18a7",
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
      pncCheckName: "NXONE",
      croNumber: "",
      crimeOffenceReferenceNumber: "",
      ownerCode: "01YZ",
      personUrn: "21/1V",
      courtCaseReference: "21/2732/000001H",
      court: {
        courtIdentityType: "code",
        courtCode: "2576"
      },
      dateOfConviction: "2011-09-26",
      defendant: {
        defendantType: "individual",
        defendantFirstNames: ["LOG"],
        defendantLastName: "NXONE"
      },
      offences: [
        {
          courtOffenceSequenceNumber: 1,
          cjsOffenceCode: "TH68006",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-09-26",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 1002,
              disposalDuration: {
                units: "months",
                count: 12
              }
            }
          ],
          offenceId: "46f0f1ef-f133-449d-acd3-f5597c883f1f"
        }
      ]
    },
    count: 1
  }),
  policeApi.mockAsnQuery({
    matchRegex: "CXE01",
    response: {
      pncCheckName: "NXONE",
      croNumber: "",
      gmh: "073ENQR000688RENQASIPNCA05A73000017300000120210903101273000001                                             050002863",
      gmt: "000010073ENQR000688R",
      personId: "1c7ff56c-6146-4e8e-9b15-06043f407a4e",
      personUrn: "21/1V",
      reportId: "240954bc-251c-4727-84ca-9a707f0376cb",
      asn: "1101ZD0100000410779H",
      ownerCode: "01ZD",
      disposals: [
        {
          crimeOffenceReferenceNumber: "",
          courtCaseId: "68a41318-ad80-4e13-ad7d-afa44c01e1ee",
          courtCaseReference: "21/2732/000001H",
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
              plea: "Not Guilty",
              offenceTic: 0,
              offenceStartDate: "2010-11-28",
              offenceId: "a22e5800-acd0-421d-be57-97f74a3f0162",
              adjudications: [
                {
                  appearanceNumber: 1,
                  adjudicationId: "938591d8-dc66-4948-bbcf-b7dde27090d0",
                  disposalDate: "2011-09-26",
                  adjudication: "Guilty"
                }
              ],
              disposalResults: [
                {
                  disposalId: "d53f21f8-2dd0-4db1-a18a-ee2f80bfd436",
                  disposalCode: 1002,
                  disposalDuration: {
                    units: "months",
                    count: 12
                  },
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
