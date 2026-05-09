import extractAsnFromInputXml from "../../utils/extractAsnFromInputXml"
import type Bichard from "../../utils/world"

export default (_: string, { policeApi }: Bichard) => [
  policeApi.mockAsnQuery({
    matchRegex: "CXE01",
    response: {
      pncCheckName: "Bass",
      croNumber: "",
      gmh: "073ENQR000020SENQASIPNCA05A73000017300000120210316152773000001                                             050001772",
      gmt: "000008073ENQR004540S",
      personId: "2c070589-c228-46c9-b19c-7eaec6ad8098",
      personUrn: "00/410801G",
      reportId: "f34755b2-5648-40c1-a00f-98fafc8ef79d",
      asn: "1101ZD0100000410801G",
      ownerCode: "01ZD",
      disposals: [
        {
          crimeOffenceReferenceNumber: "",
          courtCaseId: "8f8f7d79-5f54-436a-830e-1d548aba0fa8",
          courtCaseReference: "97/1626/008395Q",
          caseStatusMarker: "impending-prosecution-detail",
          court: {
            courtIdentityType: "code",
            courtCode: "0000"
          },
          offences: [
            {
              acpoOffenceCode: "12:15:24:1",
              courtOffenceSequenceNumber: 1,
              cjsOffenceCode: "TH68010",
              roleQualifiers: [],
              legislationQualifiers: [],
              offenceTic: 0,
              offenceStartDate: "2010-09-25",
              offenceStartTime: "00:00",
              offenceId: "9e8c0529-b732-440d-b87c-f82f71baa81e",
              disposalResults: []
            },
            {
              acpoOffenceCode: "12:15:24:1",
              courtOffenceSequenceNumber: 2,
              cjsOffenceCode: "TH68010",
              roleQualifiers: [],
              legislationQualifiers: [],
              offenceTic: 0,
              offenceStartDate: "2010-09-25",
              offenceStartTime: "00:00",
              offenceId: "595a9a3a-aec8-4184-afeb-9892bfb3610c",
              disposalResults: []
            }
          ]
        },
        {
          crimeOffenceReferenceNumber: "",
          courtCaseId: "8f8f7d79-5f54-436a-830e-1d548aba0fa8",
          courtCaseReference: "97/1626/008396R",
          caseStatusMarker: "impending-prosecution-detail",
          court: {
            courtIdentityType: "code",
            courtCode: "0000"
          },
          offences: [
            {
              acpoOffenceCode: "12:15:24:1",
              courtOffenceSequenceNumber: 1,
              cjsOffenceCode: "BG73001",
              roleQualifiers: [],
              legislationQualifiers: [],
              offenceTic: 0,
              offenceStartDate: "2012-09-25",
              offenceStartTime: "00:00",
              offenceId: "b63c4b18-ac01-4015-ae69-eb5731025d20",
              disposalResults: []
            },
            {
              acpoOffenceCode: "12:15:24:1",
              courtOffenceSequenceNumber: 2,
              cjsOffenceCode: "BG73001",
              roleQualifiers: [],
              legislationQualifiers: [],
              offenceTic: 0,
              offenceStartDate: "2012-09-25",
              offenceStartTime: "00:00",
              offenceId: "4aedb9ad-829e-4945-959e-883dda0c7fd8",
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
    count: 1,
    expectedRequest: {
      pncCheckName: "BASS",
      croNumber: "",
      crimeOffenceReferenceNumber: "",
      ownerCode: "01YZ",
      personUrn: "00/410801G",
      courtCaseReference: "97/1626/008395Q",
      court: {
        courtIdentityType: "code",
        courtCode: "2576"
      },
      dateOfConviction: "2011-10-01",
      defendant: {
        defendantType: "individual",
        defendantFirstNames: ["BARRY"],
        defendantLastName: "BASS"
      },
      offences: [
        {
          courtOffenceSequenceNumber: 1,
          cjsOffenceCode: "TH68010",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-10-01",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 1002,
              disposalDuration: {
                units: "months",
                count: 12
              }
            },
            {
              disposalCode: 3025,
              disposalDuration: {
                units: "life",
                count: 0
              },
              disposalText: "SEA MONKEY"
            }
          ],
          offenceId: "54c2ae88-057d-4cc3-acc4-ddc90e450d4f"
        },
        {
          courtOffenceSequenceNumber: 2,
          cjsOffenceCode: "TH68010",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-10-01",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 1002,
              disposalDuration: {
                units: "months",
                count: 14
              }
            },
            {
              disposalCode: 3107
            }
          ],
          offenceId: "2032651e-d61e-4941-a3bd-67ce91c509c1"
        }
      ]
    }
  }),
  policeApi.mockUpdate("CXU02", {
    count: 1,
    expectedRequest: {
      pncCheckName: "BASS",
      croNumber: "",
      crimeOffenceReferenceNumber: "",
      ownerCode: "01YZ",
      personUrn: "00/410801G",
      courtCaseReference: "97/1626/008396R",
      court: {
        courtIdentityType: "code",
        courtCode: "2576"
      },
      dateOfConviction: "2011-10-01",
      defendant: {
        defendantType: "individual",
        defendantFirstNames: ["BARRY"],
        defendantLastName: "BASS"
      },
      offences: [
        {
          courtOffenceSequenceNumber: 1,
          cjsOffenceCode: "BG73001",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-10-01",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 1002,
              disposalDuration: {
                units: "months",
                count: 12
              }
            },
            {
              disposalCode: 3025,
              disposalDuration: {
                units: "life",
                count: 0
              },
              disposalText: "SEA MONKEY"
            }
          ],
          offenceId: "97a9840b-1835-4bf0-b24c-38cb15a875d1"
        },
        {
          courtOffenceSequenceNumber: 2,
          cjsOffenceCode: "BG73001",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-10-01",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 1002,
              disposalDuration: {
                units: "months",
                count: 14
              }
            },
            {
              disposalCode: 3107
            }
          ],
          offenceId: "520a964c-4191-43f8-abfc-0f2d592dbc67"
        }
      ]
    }
  })
]
