import { SET_BY_PROCESSOR } from "../../utils/constants"
import extractAsnFromInputXml from "../../utils/extractAsnFromInputXml"
import type Bichard from "../../utils/world"

export default (_: string, { policeApi }: Bichard) => [
  policeApi.mockAsnQuery({
    matchRegex: "CXE01",
    response: {
      pncCheckName: "ORDERTOCONTI",
      croNumber: "",
      gmh: "073ENQR000326RENQASIPNCA05A73000017300000120210901131473000001                                             050002331",
      gmt: "000008073ENQR000326R",
      personId: SET_BY_PROCESSOR,
      personUrn: "2021/17M",
      reportId: SET_BY_PROCESSOR,
      asn: "1101ZD0100000448701C",
      ownerCode: "01ZD",
      disposals: [
        {
          crimeOffenceReferenceNumber: "",
          courtCaseId: SET_BY_PROCESSOR,
          courtCaseReference: "21/2732/000013W",
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
              offenceId: "2ae7cc59-e7c2-4cfe-953a-b166a9f4e2b9",
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
      personUrn: "2021/17M",
      courtCaseReference: "21/2732/000013W",
      court: {
        courtIdentityType: "code",
        courtCode: "2576"
      },
      dateOfConviction: "2011-09-26",
      defendant: {
        defendantType: "individual",
        defendantFirstNames: ["STANDALONE"],
        defendantLastName: "ORDERTOCONTINUE"
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
              disposalCode: 1116,
              disposalEffectiveDate: "2012-09-26"
            },
            {
              disposalCode: 3101,
              disposalDuration: {
                units: "hours",
                count: 100
              }
            }
          ],
          offenceId: "a8c6fa09-d7e0-4f43-9708-6abe1aa49e11"
        }
      ]
    },
    count: 1
  })
]
