import { SET_BY_PROCESSOR } from "../../utils/constants"
import extractAsnFromInputXml from "../../utils/extractAsnFromInputXml"
import type Bichard from "../../utils/world"

export default (_: string, { policeApi }: Bichard) => [
  policeApi.mockAsnQuery({
    matchRegex: "CXE01",
    response: {
      pncCheckName: "WILLIAMS",
      croNumber: "",
      gmh: "073ENQR000020SENQASIPNCA05A73000017300000120210316152773000001                                             050001772",
      gmt: "000008073ENQR004540S",
      personId: SET_BY_PROCESSOR,
      personUrn: "2013/4B",
      reportId: SET_BY_PROCESSOR,
      asn: "1300000000000000003N",
      ownerCode: "01ZD",
      disposals: [
        {
          penaltyCaseRefNo: "01ZD/1234/09",
          crimeOffenceReferenceNumber: "",
          courtCaseId: SET_BY_PROCESSOR,
          courtCaseReference: "",
          caseStatusMarker: "impending-prosecution-detail",
          court: {
            courtIdentityType: "code",
            courtCode: "0000"
          },
          offences: [
            {
              acpoOffenceCode: "12:21:5:1",
              courtOffenceSequenceNumber: 1,
              cjsOffenceCode: "CJ67002",
              roleQualifiers: [],
              legislationQualifiers: [],
              offenceTic: 0,
              offenceStartDate: "2009-06-01",
              offenceId: "45e576ac-792e-4f05-829b-ea35b6f0a85c",
              disposalResults: [
                {
                  disposalId: "da73a8ea-0800-41c7-b187-e7dfa8cf7091",
                  disposalCode: 1109,
                  disposalEffectiveDate: "",
                  disposalText: ""
                }
              ]
            }
          ]
        }
      ]
    },
    asn: extractAsnFromInputXml(`${__dirname}/input-message.xml`),
    expectedRequest: "",
    count: 1
  }),
  policeApi.mockUpdate("CXU07", {})
]
