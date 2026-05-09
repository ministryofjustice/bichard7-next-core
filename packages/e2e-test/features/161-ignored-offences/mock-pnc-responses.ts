import extractAsnFromInputXml from "../../utils/extractAsnFromInputXml"
import type Bichard from "../../utils/world"

export default (_: string, { policeApi }: Bichard) => [
  policeApi.mockAsnQuery({
    matchRegex: "CXE01",
    response: {
      pncCheckName: "JUDGE",
      croNumber: "",
      gmh: "073ENQR000706RENQASIPNCA05A73000017300000120210903102273000001                                             050002904",
      gmt: "000008073ENQR000706R",
      personId: "43056ffe-7f56-4b7d-be65-030db94c4b45",
      personUrn: "21/13H",
      reportId: "7b86026d-8645-4b25-8162-b1e93fc87c41",
      asn: "1101ZD0100000410907X",
      ownerCode: "01ZD",
      disposals: [
        {
          crimeOffenceReferenceNumber: "",
          courtCaseId: "bf222129-0f47-4ae8-b2e7-ef36a796a321",
          courtCaseReference: "21/2732/000009R",
          caseStatusMarker: "impending-prosecution-detail",
          court: {
            courtIdentityType: "code",
            courtCode: "0000"
          },
          offences: [
            {
              acpoOffenceCode: "",
              courtOffenceSequenceNumber: 1,
              cjsOffenceCode: "RR84042",
              roleQualifiers: [],
              legislationQualifiers: [],
              offenceTic: 0,
              offenceStartDate: "2010-11-28",
              offenceId: "29e1518f-c644-425c-96e8-736dbfe4cf21",
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
      pncCheckName: "JUDGE",
      croNumber: "",
      crimeOffenceReferenceNumber: "",
      ownerCode: "01YZ",
      personUrn: "21/13H",
      courtCaseReference: "21/2732/000009R",
      court: {
        courtIdentityType: "code",
        courtCode: "2576"
      },
      dateOfConviction: "2011-09-26",
      defendant: {
        defendantType: "individual",
        defendantFirstNames: ["FRANKLIN"],
        defendantLastName: "JUDGE"
      },
      offences: [
        {
          courtOffenceSequenceNumber: 1,
          cjsOffenceCode: "RR84042",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-09-26",
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
          offenceId: "da71060c-cfb2-4048-8f67-81f714efd655"
        }
      ]
    },
    count: 1
  }),
  policeApi.mockAsnQuery({
    matchRegex: "CXE01",
    response: {
      pncCheckName: "JUDGE",
      croNumber: "",
      gmh: "073ENQR000707RENQASIPNCA05A73000017300000120210903102273000001                                             050002906",
      gmt: "000010073ENQR000707R",
      personId: "341c84a7-7444-46bd-afd6-4cf7a0028b34",
      personUrn: "21/13H",
      reportId: "de31e435-9cc5-41e0-8789-2411fe439ea9",
      asn: "1101ZD0100000410907X",
      ownerCode: "01ZD",
      disposals: [
        {
          crimeOffenceReferenceNumber: "",
          courtCaseId: "4d28fe3f-b8a2-437a-a3c6-8a862b2f39a4",
          courtCaseReference: "21/2732/000009R",
          caseStatusMarker: "impending-prosecution-detail",
          court: {
            courtIdentityType: "code",
            courtCode: "0000"
          },
          offences: [
            {
              acpoOffenceCode: "",
              courtOffenceSequenceNumber: 1,
              cjsOffenceCode: "RR84042",
              roleQualifiers: [],
              legislationQualifiers: [],
              plea: "Not Guilty",
              offenceTic: 0,
              offenceStartDate: "2010-11-28",
              offenceId: "58caeccf-1990-457d-8eeb-cc7fda01c33d",
              adjudications: [
                {
                  appearanceNumber: 1,
                  adjudicationId: "a7b51b5f-aacb-4fbb-a66c-9e8e81270e0b",
                  disposalDate: "2011-09-26",
                  adjudication: "Guilty"
                }
              ],
              disposalResults: [
                {
                  disposalId: "766a2a2b-7a6d-4c94-9e29-790f0bb5fb95",
                  disposalCode: 1002,
                  disposalDuration: {
                    units: "months",
                    count: 12
                  },
                  disposalText: ""
                }
              ]
            }
          ]
        }
      ]
    },
    asn: extractAsnFromInputXml(`${__dirname}/input-message-2.xml`),
    expectedRequest: "",
    count: 1
  })
]
