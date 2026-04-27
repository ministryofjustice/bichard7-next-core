import type Bichard from "../../utils/world"

export default (ncm: string, { policeApi }: Bichard) => [
  policeApi.mockEnquiryFromNcm(ncm),
  policeApi.mockUpdate("CXU02", {
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
          offenceId: "ac4fdfd3-48d5-42c7-b304-8116ed5287c4"
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
          offenceId: "fa969aac-e4fc-4280-9e5c-a5577e666994"
        },
        {
          courtOffenceSequenceNumber: 3,
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
          offenceId: "4868561c-d79a-4212-8210-750ae5428ec1"
        },
        {
          courtOffenceSequenceNumber: 4,
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
          offenceId: "2106bddb-7f58-438b-b327-3643f9ab0d8c"
        }
      ]
    }
  })
]
