import { SET_BY_PROCESSOR } from "../../utils/constants"
import extractAsnFromInputXml from "../../utils/extractAsnFromInputXml"
import type Bichard from "../../utils/world"

export default (_: string, { policeApi }: Bichard) => [
  policeApi.mockAsnQuery({
    matchRegex: "CXE01",
    response: {
      pncCheckName: "FOARDS",
      croNumber: "",
      gmh: "073ENQR000309RENQASIPNCA05A73000017300000120210901125273000001                                             050002297",
      gmt: "000008073ENQR000309R",
      personId: SET_BY_PROCESSOR,
      personUrn: "21/7B",
      reportId: SET_BY_PROCESSOR,
      asn: "1101ZD0100000410857T",
      ownerCode: "01ZD",
      disposals: [
        {
          crimeOffenceReferenceNumber: "",
          courtCaseId: SET_BY_PROCESSOR,
          courtCaseReference: "21/2732/000007P",
          caseStatusMarker: "impending-prosecution-detail",
          court: {
            courtIdentityType: "code",
            courtCode: "0000"
          },
          offences: [
            {
              acpoOffenceCode: "8:7:45:2",
              courtOffenceSequenceNumber: 1,
              cjsOffenceCode: "PC00525",
              roleQualifiers: [],
              legislationQualifiers: [],
              offenceTic: 0,
              offenceStartDate: "2010-07-01",
              offenceEndDate: "2010-07-02",
              offenceId: "3cce8940-a6a1-4005-ba8d-9fdceb406e1c",
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
      personUrn: "21/7B",
      courtCaseReference: "21/2732/000007P",
      court: {
        courtIdentityType: "code",
        courtCode: "2576"
      },
      dateOfConviction: "2011-08-01",
      defendant: {
        defendantType: "individual",
        defendantFirstNames: ["LORNE"],
        defendantLastName: "FOARDSXX"
      },
      offences: [
        {
          courtOffenceSequenceNumber: 1,
          cjsOffenceCode: "PC00525",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-08-01",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 1040
            },
            {
              disposalCode: 1087
            }
          ],
          offenceId: "92b346b1-9949-4a9e-a62f-bd382b0fd364"
        }
      ]
    },
    count: 1
  })
]
