import { SET_BY_PROCESSOR } from "../../utils/constants"
import extractAsnFromInputXml from "../../utils/extractAsnFromInputXml"
import type Bichard from "../../utils/world"

export default (_: string, { policeApi }: Bichard) => [
  policeApi.mockAsnQuery({
    matchRegex: "CXE01",
    response: {
      pncCheckName: "SUSSENTENCE",
      croNumber: "",
      gmh: "073ENQR000697RENQASIPNCA05A73000017300000120210903102173000001                                             050002883",
      gmt: "000008073ENQR000697R",
      personId: SET_BY_PROCESSOR,
      longPersonUrn: "2021/28Z",
      reportId: SET_BY_PROCESSOR,
      asn: "1101ZD0100000410750B",
      ownerCode: "01ZD",
      disposals: [
        {
          crimeOffenceReferenceNumber: "",
          courtCaseId: SET_BY_PROCESSOR,
          courtCaseReference: "21/2732/000022F",
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
              offenceId: "86c51216-0d9b-4aa1-b3e3-28eb9a54964b",
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
      pncCheckName: "SUSSENTENCE",
      croNumber: "",
      crimeOffenceReferenceNumber: "",
      ownerCode: "01YZ",
      longPersonUrn: "2021/28Z",
      courtCaseReference: "21/2732/000022F",
      court: {
        courtIdentityType: "code",
        courtCode: "2576"
      },
      dateOfConviction: "2011-09-26",
      defendant: {
        defendantType: "individual",
        defendantFirstNames: ["BREACH"],
        defendantLastName: "SUSSENTENCE"
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
              disposalCode: 1115,
              disposalDuration: {
                units: "months",
                count: 4
              },
              disposalQualifiers: ["S"],
              disposalQualifierDuration: {
                units: "months",
                count: 12
              }
            }
          ],
          offenceId: "997ff8ae-bbe7-471e-8c69-8eda0eec767d"
        }
      ]
    },
    count: 1
  })
]
