import type Bichard from "../../utils/world"

export default (ncm: string, { policeApi }: Bichard) => [
  policeApi.mockEnquiryFromNcm(ncm),
  policeApi.mockUpdate("CXU02", {
    expectedRequest: {
      pncCheckName: "MORETHANONEO",
      croNumber: "",
      crimeOffenceReferenceNumber: "",
      ownerCode: "01YZ",
      personUrn: "00/440808Y",
      courtCaseReference: "97/1626/008395Q",
      court: {
        courtIdentityType: "code",
        courtCode: "2576"
      },
      dateOfConviction: "2011-09-26",
      defendant: {
        defendantType: "individual",
        defendantFirstNames: ["TAGGING"],
        defendantLastName: "MORETHANONEOFFENCE"
      },
      offences: [
        {
          courtOffenceSequenceNumber: 1,
          cjsOffenceCode: "PL96001",
          plea: "No Plea Taken",
          adjudication: "Guilty",
          dateOfSentence: "2011-09-26",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 1115,
              disposalDuration: {
                units: "months",
                count: 3
              },
              disposalQualifiers: ["C", "S"],
              disposalQualifierDuration: {
                units: "months",
                count: 12
              }
            },
            {
              disposalCode: 3105,
              disposalDuration: {
                units: "months",
                count: 2
              },
              disposalQualifiers: ["BA"]
            }
          ],
          offenceId: "bc2ceb60-e8b4-47e7-ac1d-e2421d6523e0"
        },
        {
          courtOffenceSequenceNumber: 2,
          cjsOffenceCode: "PL96002",
          plea: "No Plea Taken",
          adjudication: "Guilty",
          dateOfSentence: "2011-09-26",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 1115,
              disposalDuration: {
                units: "months",
                count: 3
              },
              disposalQualifiers: ["C", "S"],
              disposalQualifierDuration: {
                units: "months",
                count: 12
              }
            },
            {
              disposalCode: 3105,
              disposalDuration: {
                units: "months",
                count: 2
              },
              disposalQualifiers: ["BA"]
            }
          ],
          offenceId: "b6b55365-29d3-4aee-b751-bc63d2531738"
        },
        {
          courtOffenceSequenceNumber: 3,
          cjsOffenceCode: "PL96004",
          plea: "No Plea Taken",
          adjudication: "Guilty",
          dateOfSentence: "2011-09-26",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 1115,
              disposalDuration: {
                units: "days",
                count: 14
              },
              disposalQualifiers: ["C", "S"],
              disposalQualifierDuration: {
                units: "months",
                count: 12
              }
            },
            {
              disposalCode: 3105,
              disposalDuration: {
                units: "months",
                count: 2
              },
              disposalQualifiers: ["BA"]
            }
          ],
          offenceId: "854fdaf8-aab5-4782-ad0b-207bc4fee37b"
        }
      ]
    }
  })
]
