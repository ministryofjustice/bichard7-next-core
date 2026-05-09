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
      personId: "41860ba3-d12e-406a-87ff-fc996c43d020",
      personUrn: "12/14X",
      reportId: "0cee7928-d6e3-4cb3-8ecd-ba38f571f0cd",
      asn: "1200000000000000006T",
      ownerCode: "04CA",
      disposals: [
        {
          crimeOffenceReferenceNumber: "",
          courtCaseId: "53a5f61b-eb67-477e-b9e8-a1a2745e721d",
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
              offenceId: "60e2b500-b041-498c-a649-43ebd56e7586",
              disposalResults: []
            }
          ]
        },
        {
          crimeOffenceReferenceNumber: "",
          courtCaseId: "53a5f61b-eb67-477e-b9e8-a1a2745e721d",
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
              offenceId: "dee599ce-51c2-42c2-b54b-093e427cc758",
              disposalResults: []
            }
          ]
        },
        {
          crimeOffenceReferenceNumber: "",
          courtCaseId: "53a5f61b-eb67-477e-b9e8-a1a2745e721d",
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
              offenceId: "1c54318a-aa4c-4ac8-b908-48a8e43cb060",
              disposalResults: []
            }
          ]
        }
      ]
    },
    asn: extractAsnFromInputXml(`${__dirname}/input-message.xml`),
    expectedRequest: ""
  }),
  policeApi.mockUpdate("CXU02", {
    expectedRequest: {
      pncCheckName: "AVALON",
      croNumber: "",
      crimeOffenceReferenceNumber: "",
      ownerCode: "04YZ",
      personUrn: "12/14X",
      courtCaseReference: "12/2732/000017U",
      court: {
        courtIdentityType: "code",
        courtCode: "2576"
      },
      dateOfConviction: "2009-10-01",
      defendant: {
        defendantType: "individual",
        defendantFirstNames: ["MARTIN"],
        defendantLastName: "AVALON"
      },
      offences: [
        {
          courtOffenceSequenceNumber: 1,
          cjsOffenceCode: "OF61016",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2009-10-01",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 1002,
              disposalDuration: {
                units: "months",
                count: 11
              }
            }
          ],
          offenceId: "6f32a85c-c0b2-4940-a90e-59466c899f6e"
        }
      ]
    }
  })
]
