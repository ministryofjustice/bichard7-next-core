import extractAsnFromInputXml from "../../utils/extractAsnFromInputXml"
import type Bichard from "../../utils/world"

export default (_: string, { policeApi }: Bichard) => [
  policeApi.mockAsnQuery({
    matchRegex: "CXE01",
    response: {
      pncCheckName: "CIVILCASE",
      croNumber: "",
      gmh: "073ENQR000343RENQASIPNCA05A73000017300000120210901141073000001                                             050002370",
      gmt: "000008073ENQR000343R",
      personId: "f5ccd217-4827-4c9d-af39-5580cbbbcf97",
      personUrn: "21/25W",
      reportId: "4ae4291d-84a5-4515-b9ea-cc99dd3fca13",
      asn: "1301ZD0100000449618X",
      ownerCode: "01ZD",
      disposals: [
        {
          crimeOffenceReferenceNumber: "",
          courtCaseId: "8a42453b-c7ee-4239-8654-fb8191d7c71f",
          courtCaseReference: "21/2732/000020D",
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
              offenceStartDate: "2011-09-26",
              offenceId: "eb9676fa-5255-4db3-a44b-01b8cf7c810c",
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
      pncCheckName: "CIVILCASE",
      croNumber: "",
      crimeOffenceReferenceNumber: "",
      ownerCode: "01YZ",
      personUrn: "21/25W",
      courtCaseReference: "21/2732/000020D",
      court: {
        courtIdentityType: "code",
        courtCode: "2576"
      },
      dateOfConviction: "2011-09-26",
      defendant: {
        defendantType: "individual",
        defendantFirstNames: ["ADDEDATSENTENCE"],
        defendantLastName: "CIVILCASE"
      },
      offences: [
        {
          courtOffenceSequenceNumber: 1,
          cjsOffenceCode: "TH68010",
          plea: "Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-09-26",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 4011,
              disposalEffectiveDate: "2011-10-26"
            }
          ],
          offenceId: "46bfe02d-fa32-43f2-a20d-6be63db67cf8"
        }
      ]
    },
    count: 1
  }),
  policeApi.mockUpdate("CXU01", {
    expectedRequest: {
      pncCheckName: "CIVILCASE",
      croNumber: "",
      arrestSummonsNumber: "13/01ZD/01/449618X",
      crimeOffenceReferenceNo: "",
      remandLocationFfss: "",
      ownerCode: "01YZ",
      personUrn: "21/25W",
      remandDate: "2011-09-26",
      appearanceResult: "adjourned",
      bailConditions: [],
      currentAppearance: {
        court: {
          courtIdentityType: "code",
          courtCode: "2576"
        }
      },
      nextAppearance: {
        date: "2011-10-26",
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
      pncCheckName: "CIVILCASE",
      croNumber: "",
      gmh: "073ENQR000344RENQASIPNCA05A73000017300000120210901141073000001                                             050002373",
      gmt: "000010073ENQR000344R",
      personId: "8a077756-a4fc-4950-916a-a058468c6d1f",
      personUrn: "21/25W",
      reportId: "ed2fe9a8-94b3-47e5-8ae4-06ffa2e9ce49",
      asn: "1301ZD0100000449618X",
      ownerCode: "01ZD",
      disposals: [
        {
          crimeOffenceReferenceNumber: "",
          courtCaseId: "7ea323d9-e48a-47a1-b083-11f99b8d65d3",
          courtCaseReference: "21/2732/000020D",
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
              plea: "Guilty",
              offenceTic: 0,
              offenceStartDate: "2011-09-26",
              offenceId: "c645355a-bbac-4825-a4d0-9d01fdc4080f",
              adjudications: [
                {
                  appearanceNumber: 1,
                  adjudicationId: "616fac8b-b3db-4c41-8f9f-f651bccf05ae",
                  disposalDate: "2011-09-26",
                  adjudication: "Guilty"
                }
              ],
              disposalResults: [
                {
                  disposalId: "7daf0286-37bf-4a31-8570-158e2f9a8493",
                  disposalCode: 4011,
                  disposalEffectiveDate: "2011-10-26",
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
  }),
  policeApi.mockUpdate("CXU04", {
    expectedRequest: {
      pncCheckName: "CIVILCASE",
      croNumber: "",
      crimeOffenceReferenceNumber: "",
      ownerCode: "01YZ",
      personUrn: "21/25W",
      courtCaseReference: "21/2732/000020D",
      court: {
        courtIdentityType: "code",
        courtCode: "2576"
      },
      appearanceDate: "2011-10-26",
      reasonForAppearance: "Sentence Deferred",
      offences: [
        {
          courtOffenceSequenceNumber: 1,
          cjsOffenceCode: "TH68010",
          disposalResults: [
            {
              disposalCode: 1002,
              disposalDuration: {
                units: "weeks",
                count: 16
              }
            }
          ],
          offenceId: "c9e0c409-7be5-4751-a079-e92b3f52d436"
        }
      ]
    },
    count: 1
  })
]
