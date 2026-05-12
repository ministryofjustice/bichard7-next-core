import { SET_BY_PROCESSOR } from "../../utils/constants"
import extractAsnFromInputXml from "../../utils/extractAsnFromInputXml"
import type Bichard from "../../utils/world"

export default (_: string, { policeApi }: Bichard) => [
  policeApi.mockAsnQuery({
    matchRegex: "CXE01",
    response: {
      pncCheckName: "FOARDS",
      croNumber: "",
      gmh: "073ENQR000308RENQASIPNCA05A73000017300000120210901125273000001                                             050002295",
      gmt: "000008073ENQR000308R",
      personId: SET_BY_PROCESSOR,
      personUrn: "21/8C",
      reportId: SET_BY_PROCESSOR,
      asn: "1101ZD0100000410848H",
      ownerCode: "01ZD",
      disposals: [
        {
          crimeOffenceReferenceNumber: "",
          courtCaseId: SET_BY_PROCESSOR,
          courtCaseReference: "21/2732/000008Q",
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
              offenceId: "b334b649-4a7a-48d1-af65-bbff6fc9f098",
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
  policeApi.mockUpdate("CXU02", {
    expectedRequest: {
      pncCheckName: "FOARDS",
      croNumber: "",
      crimeOffenceReferenceNumber: "",
      ownerCode: "01YZ",
      personUrn: "21/8C",
      courtCaseReference: "21/2732/000008Q",
      court: {
        courtIdentityType: "code",
        courtCode: "2576"
      },
      dateOfConviction: "2011-09-26",
      defendant: {
        defendantType: "individual",
        defendantFirstNames: ["LORNE"],
        defendantLastName: "FOARDS"
      },
      offences: [
        {
          courtOffenceSequenceNumber: 1,
          cjsOffenceCode: "CJ88116",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-09-26",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 1018,
              disposalDuration: {
                units: "months",
                count: 12
              }
            }
          ],
          offenceId: "6b831cc0-eaa8-4c04-ad22-a132478fa7e5"
        }
      ]
    },
    count: 1
  })
]
