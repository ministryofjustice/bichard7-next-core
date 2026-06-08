import { SET_BY_PROCESSOR } from "../../utils/constants"
import extractAsnFromInputXml from "../../utils/extractAsnFromInputXml"
import type Bichard from "../../utils/world"

export default (_: string, { policeApi }: Bichard) => [
  policeApi.mockAsnQuery({
    matchRegex: "CXE01",
    response: {
      pncCheckName: "SUSSENTENCE",
      croNumber: "",
      gmh: "073ENQR000698RENQASIPNCA05A73000017300000120210903102173000001                                             050002885",
      gmt: "000008073ENQR000698R",
      personId: SET_BY_PROCESSOR,
      longPersonUrn: "2021/29A",
      reportId: SET_BY_PROCESSOR,
      asn: "1101ZD0100000410752D",
      ownerCode: "01ZD",
      disposals: [
        {
          crimeOffenceReferenceNumber: "",
          courtCaseId: SET_BY_PROCESSOR,
          courtCaseReference: "21/2732/000023G",
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
              offenceStartDate: "2010-10-01",
              offenceId: "98ce8e4c-e61d-4a9c-aea7-74f338e132ae",
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
      longPersonUrn: "2021/29A",
      courtCaseReference: "21/2732/000023G",
      court: {
        courtIdentityType: "code",
        courtCode: "2576"
      },
      dateOfConviction: "2011-10-26",
      defendant: {
        defendantType: "individual",
        defendantFirstNames: ["BREACH"],
        defendantLastName: "SUSSENTENCETWO"
      },
      offences: [
        {
          courtOffenceSequenceNumber: 1,
          cjsOffenceCode: "TH68010",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-10-26",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 1002,
              disposalDuration: {
                units: "months",
                count: 3
              }
            }
          ],
          offenceId: "b4bc868e-684a-4fe6-8352-c3bbdabc9cc5"
        }
      ]
    },
    count: 1
  })
]
