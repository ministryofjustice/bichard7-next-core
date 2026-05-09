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
      personId: "c3eab6d1-8c06-4a0c-9db2-3eb6e5699325",
      personUrn: "12/14X",
      reportId: "5e6de48d-d320-4d55-9e55-c89d5add9671",
      asn: "1200000000000000006T",
      ownerCode: "04CA",
      disposals: [
        {
          crimeOffenceReferenceNumber: "",
          courtCaseId: "b2253937-9060-4294-a345-1c19ba80b646",
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
              offenceId: "bc394d99-8d49-4bf7-a7c2-f7d840432165",
              disposalResults: []
            }
          ]
        },
        {
          crimeOffenceReferenceNumber: "",
          courtCaseId: "b2253937-9060-4294-a345-1c19ba80b646",
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
              cjsOffenceCode: "SX03001A",
              roleQualifiers: [],
              legislationQualifiers: [],
              offenceTic: 0,
              offenceStartDate: "2009-06-01",
              offenceId: "8e486b74-9bfe-4ab7-8d14-39e8cf329bd2",
              disposalResults: []
            },
            {
              acpoOffenceCode: "1:9:7:1",
              courtOffenceSequenceNumber: 2,
              cjsOffenceCode: "OF61016",
              roleQualifiers: [],
              legislationQualifiers: [],
              offenceTic: 0,
              offenceStartDate: "2009-06-01",
              offenceId: "a45756f0-8507-4425-8401-7aa665c64f66",
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
    matchRegex: "CXU02.*SX03001A",
    count: 1,
    expectedRequest: {
      pncCheckName: "AVALON",
      croNumber: "",
      crimeOffenceReferenceNumber: "",
      ownerCode: "04YZ",
      personUrn: "12/14X",
      courtCaseReference: "12/2732/000016T",
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
          courtOffenceSequenceNumber: 2,
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
          offenceId: "d03a0417-16b6-49ad-9ef8-3d17e38ffdbf"
        },
        {
          courtOffenceSequenceNumber: 1,
          cjsOffenceCode: "SX03001A",
          roleQualifiers: ["AT"],
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2009-10-01",
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
          offenceId: "8e9bf65e-9543-422a-a1d8-71961dc4eeea"
        }
      ]
    }
  }),
  policeApi.mockUpdate("CXU02", {
    matchRegex: "CXU02.*I1002M10",
    count: 1,
    expectedRequest: {
      pncCheckName: "AVALON",
      croNumber: "",
      crimeOffenceReferenceNumber: "",
      ownerCode: "04YZ",
      personUrn: "12/14X",
      courtCaseReference: "12/2732/000015R",
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
                count: 10
              }
            },
            {
              disposalCode: 1002,
              disposalDuration: {
                units: "months",
                count: 12
              }
            }
          ],
          offenceId: "0297c203-5a16-4ca4-a025-30bc1fedcb35"
        }
      ]
    }
  })
]
