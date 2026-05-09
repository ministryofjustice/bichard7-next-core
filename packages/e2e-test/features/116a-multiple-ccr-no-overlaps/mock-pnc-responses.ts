import extractAsnFromInputXml from "../../utils/extractAsnFromInputXml"
import type Bichard from "../../utils/world"

export default (_: string, { policeApi }: Bichard) => [
  policeApi.mockAsnQuery({
    matchRegex: "CXE01",
    response: {
      pncCheckName: "MILES",
      croNumber: "",
      gmh: "073ENQR000132RENQASIPNCA05A73000017300000120210831090973000001                                             050001947",
      gmt: "000010073ENQR000132R",
      personId: "17e6aa1a-7baf-4691-af84-0692912e5a57",
      personUrn: "09/477E",
      reportId: "0e3a9e2c-2ced-46bf-a91c-7ca8e82e1591",
      asn: "0900000000000020001E",
      ownerCode: "01VK",
      disposals: [
        {
          crimeOffenceReferenceNumber: "",
          courtCaseId: "981e673c-7eed-49d8-b208-94be70fb12b4",
          courtCaseReference: "09/0428/000442C",
          caseStatusMarker: "impending-prosecution-detail",
          court: {
            courtIdentityType: "code",
            courtCode: "0000"
          },
          offences: [
            {
              acpoOffenceCode: "5:1:1:1",
              courtOffenceSequenceNumber: 1,
              cjsOffenceCode: "TH68023",
              roleQualifiers: [],
              legislationQualifiers: [],
              offenceTic: 0,
              offenceStartDate: "2009-06-01",
              offenceId: "6f52a25d-70af-42cf-ae9b-4b5a261b3275",
              disposalResults: []
            }
          ]
        },
        {
          crimeOffenceReferenceNumber: "",
          courtCaseId: "981e673c-7eed-49d8-b208-94be70fb12b4",
          courtCaseReference: "09/0413/000443F",
          caseStatusMarker: "impending-prosecution-detail",
          court: {
            courtIdentityType: "code",
            courtCode: "0000"
          },
          offences: [
            {
              acpoOffenceCode: "11:1:5:1",
              courtOffenceSequenceNumber: 1,
              cjsOffenceCode: "FI68068",
              roleQualifiers: [],
              legislationQualifiers: [],
              offenceTic: 0,
              offenceStartDate: "2009-06-01",
              offenceId: "e36f600d-469a-4d3f-8c64-75f7a68edd67",
              disposalResults: []
            }
          ]
        }
      ]
    },
    asn: extractAsnFromInputXml(`${__dirname}/input-message-1.xml`),
    expectedRequest: "",
    count: 1
  }),
  policeApi.mockUpdate("CXU02", {
    expectedRequest: {
      pncCheckName: "MILES",
      croNumber: "",
      crimeOffenceReferenceNumber: "",
      ownerCode: "01YZ",
      personUrn: "09/477E",
      courtCaseReference: "09/0428/000442C",
      court: {
        courtIdentityType: "code",
        courtCode: "2576"
      },
      dateOfConviction: "2009-10-01",
      defendant: {
        defendantType: "individual",
        defendantFirstNames: ["WILLIAM"],
        defendantLastName: "MILES"
      },
      offences: [
        {
          courtOffenceSequenceNumber: 1,
          cjsOffenceCode: "TH68023",
          plea: "Not Guilty",
          adjudication: "Not Guilty",
          dateOfSentence: "2009-10-01",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 2006
            }
          ],
          offenceId: "f0e2890d-f3ea-4909-a572-ff0fdcdab713"
        }
      ]
    },
    count: 1
  }),
  policeApi.mockUpdate("CXU01", {
    expectedRequest: {
      pncCheckName: "MILES",
      croNumber: "",
      arrestSummonsNumber: "09/0000/00/20001E",
      crimeOffenceReferenceNo: "",
      remandLocationFfss: "",
      ownerCode: "01YZ",
      personUrn: "09/477E",
      remandDate: "2009-10-01",
      appearanceResult: "remanded-on-bail",
      bailConditions: [],
      currentAppearance: {
        court: {
          courtIdentityType: "code",
          courtCode: "2576"
        }
      },
      nextAppearance: {
        date: "2009-11-01",
        court: {
          courtIdentityType: "code",
          courtCode: "2576"
        }
      }
    },
    count: 1
  }),
  policeApi.mockAsnQuery({
    matchRegex: "CXE01",
    response: {
      pncCheckName: "MILES",
      croNumber: "",
      gmh: "073ENQR000133RENQASIPNCA05A73000017300000120210831090973000001                                             050001950",
      gmt: "000012073ENQR000133R",
      personId: "007f8659-5d12-4454-8250-5072d7bd7b52",
      personUrn: "09/477E",
      reportId: "52e8804c-c80c-4e12-93bf-905543b5cd48",
      asn: "0900000000000020001E",
      ownerCode: "01VK",
      disposals: [
        {
          crimeOffenceReferenceNumber: "",
          courtCaseId: "3625295a-6610-45aa-8658-23f8446a2fdc",
          courtCaseReference: "09/0428/000442C",
          caseStatusMarker: "impending-prosecution-detail",
          court: {
            courtIdentityType: "code",
            courtCode: "0000"
          },
          offences: [
            {
              acpoOffenceCode: "5:1:1:1",
              courtOffenceSequenceNumber: 1,
              cjsOffenceCode: "TH68023",
              roleQualifiers: [],
              legislationQualifiers: [],
              plea: "Not Guilty",
              offenceTic: 0,
              offenceStartDate: "2009-06-01",
              offenceId: "b7b452c6-6b5b-46f6-bada-8dbff88023ef",
              adjudications: [
                {
                  appearanceNumber: 1,
                  adjudicationId: "a71733e5-f5b8-435d-ab69-03022a572a2d",
                  disposalDate: "2009-10-01",
                  adjudication: "Not Guilty"
                }
              ],
              disposalResults: [
                {
                  disposalId: "8f05e413-9cc8-43a3-9238-6dc5d4e3198b",
                  disposalCode: 2006,
                  disposalText: ""
                }
              ]
            }
          ]
        },
        {
          crimeOffenceReferenceNumber: "",
          courtCaseId: "3625295a-6610-45aa-8658-23f8446a2fdc",
          courtCaseReference: "09/0413/000443F",
          caseStatusMarker: "impending-prosecution-detail",
          court: {
            courtIdentityType: "code",
            courtCode: "0000"
          },
          offences: [
            {
              acpoOffenceCode: "11:1:5:1",
              courtOffenceSequenceNumber: 1,
              cjsOffenceCode: "FI68068",
              roleQualifiers: [],
              legislationQualifiers: [],
              offenceTic: 0,
              offenceStartDate: "2009-06-01",
              offenceId: "e401fd51-0e1e-412f-8488-041154b9230b",
              disposalResults: []
            }
          ]
        }
      ]
    },
    asn: extractAsnFromInputXml(`${__dirname}/input-message-2.xml`),
    expectedRequest: "",
    count: 1
  }),
  policeApi.mockUpdate("CXU02", {
    expectedRequest: {
      pncCheckName: "MILES",
      croNumber: "",
      crimeOffenceReferenceNumber: "",
      ownerCode: "01YZ",
      personUrn: "09/477E",
      courtCaseReference: "09/0413/000443F",
      court: {
        courtIdentityType: "code",
        courtCode: "2576"
      },
      dateOfConviction: "2009-11-01",
      defendant: {
        defendantType: "individual",
        defendantFirstNames: ["WILLIAM"],
        defendantLastName: "MILES"
      },
      offences: [
        {
          courtOffenceSequenceNumber: 1,
          cjsOffenceCode: "FI68068",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2009-11-01",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 1002,
              disposalDuration: {
                units: "months",
                count: 10
              }
            }
          ],
          offenceId: "b7d63acf-4f85-4666-9d57-0eb6891ca133"
        }
      ]
    },
    count: 1
  })
]
