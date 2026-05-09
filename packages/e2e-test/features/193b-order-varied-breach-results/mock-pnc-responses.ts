import extractAsnFromInputXml from "../../utils/extractAsnFromInputXml"
import type Bichard from "../../utils/world"

export default (_: string, { policeApi }: Bichard) => [
  policeApi.mockAsnQuery({
    matchRegex: "CXE01",
    response: {
      pncCheckName: "ORDERTOCONTI",
      croNumber: "",
      gmh: "073ENQR000327RENQASIPNCA05A73000017300000120210901131473000001                                             050002333",
      gmt: "000008073ENQR000327R",
      personId: "d9220b7b-2d11-4a8e-b286-8de45d8ccc4e",
      personUrn: "21/18N",
      reportId: "861d0511-28fe-4ede-98c9-7872355ac424",
      asn: "1101VK0100000376284N",
      ownerCode: "01VK",
      disposals: [
        {
          crimeOffenceReferenceNumber: "",
          courtCaseId: "43888798-969c-46b4-bd0d-76d9cefa44c8",
          courtCaseReference: "21/2812/000004H",
          caseStatusMarker: "impending-prosecution-detail",
          court: {
            courtIdentityType: "code",
            courtCode: "0000"
          },
          offences: [
            {
              acpoOffenceCode: "8:7:69:3",
              courtOffenceSequenceNumber: 1,
              cjsOffenceCode: "CJ03510",
              roleQualifiers: [],
              legislationQualifiers: [],
              offenceTic: 0,
              offenceStartDate: "2009-10-01",
              offenceId: "f2763bd1-e941-40a6-ae5b-5fac315872d8",
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
      pncCheckName: "ORDERTOCONTI",
      croNumber: "",
      crimeOffenceReferenceNumber: "",
      ownerCode: "01YZ",
      personUrn: "21/18N",
      courtCaseReference: "21/2812/000004H",
      court: {
        courtIdentityType: "code",
        courtCode: "2576"
      },
      dateOfConviction: "2009-10-26",
      defendant: {
        defendantType: "individual",
        defendantFirstNames: ["STANDALONE"],
        defendantLastName: "ORDERTOCONTINUETWO"
      },
      offences: [
        {
          courtOffenceSequenceNumber: 1,
          cjsOffenceCode: "CJ03510",
          plea: "Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2009-10-26",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 1030
            }
          ],
          offenceId: "6de99c69-30c5-4123-add6-79846a5db258"
        }
      ]
    },
    count: 1
  })
]
