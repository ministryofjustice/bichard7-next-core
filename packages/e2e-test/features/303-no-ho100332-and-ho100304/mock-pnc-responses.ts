import { SET_BY_PROCESSOR } from "../../utils/constants"
import extractAsnFromInputXml from "../../utils/extractAsnFromInputXml"
import type Bichard from "../../utils/world"

export default (_: string, { policeApi }: Bichard) => [
  policeApi.mockAsnQuery({
    matchRegex: "CXE01",
    response: {
      pncCheckName: "AVALON",
      croNumber: "",
      gmh: "073ENQR000020SENQASIPNCA05A73000017300000120210316152773000001                                             050001772",
      gmt: "000008073ENQR004540S",
      personId: SET_BY_PROCESSOR,
      personUrn: "2012/14X",
      reportId: SET_BY_PROCESSOR,
      asn: "1200000000000000006T",
      ownerCode: "01ZD",
      disposals: [
        {
          crimeOffenceReferenceNumber: "",
          courtCaseId: SET_BY_PROCESSOR,
          courtCaseReference: "12/2732/000015R",
          caseStatusMarker: "impending-prosecution-detail",
          court: {
            courtIdentityType: "code",
            courtCode: "0000"
          },
          offences: [
            {
              acpoOffenceCode: "1:9:7:1",
              courtOffenceSequenceNumber: 1,
              cjsOffenceCode: "OF61016",
              roleQualifiers: [],
              legislationQualifiers: [],
              offenceTic: 0,
              offenceStartDate: "2009-06-01",
              offenceId: "da834f0b-88e9-4b61-9dd6-4378b6ded539",
              disposalResults: []
            }
          ]
        },
        {
          crimeOffenceReferenceNumber: "",
          courtCaseId: SET_BY_PROCESSOR,
          courtCaseReference: "12/2732/000016T",
          caseStatusMarker: "impending-prosecution-detail",
          court: {
            courtIdentityType: "code",
            courtCode: "0000"
          },
          offences: [
            {
              acpoOffenceCode: "1:9:7:1",
              courtOffenceSequenceNumber: 1,
              cjsOffenceCode: "OF61016",
              roleQualifiers: [],
              legislationQualifiers: [],
              offenceTic: 0,
              offenceStartDate: "2009-06-01",
              offenceId: "2403dc5c-3a7d-42c6-9eb2-335aaab5ed11",
              disposalResults: []
            }
          ]
        },
        {
          crimeOffenceReferenceNumber: "",
          courtCaseId: SET_BY_PROCESSOR,
          courtCaseReference: "12/2732/000017U",
          caseStatusMarker: "impending-prosecution-detail",
          court: {
            courtIdentityType: "code",
            courtCode: "0000"
          },
          offences: [
            {
              acpoOffenceCode: "1:9:7:1",
              courtOffenceSequenceNumber: 1,
              cjsOffenceCode: "OF61016",
              roleQualifiers: [],
              legislationQualifiers: [],
              offenceTic: 0,
              offenceStartDate: "2009-06-01",
              offenceId: "139782bb-fed9-4c76-9bec-b08cc0049d43",
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
  policeApi.generateDummyUpdate()
]
