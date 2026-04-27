import type Bichard from "../../utils/world"

export default (ncm: string, { policeApi }: Bichard) => [
  policeApi.mockEnquiryFromNcm(ncm),
  policeApi.mockUpdate("CXU02", {
    expectedRequest: {
      pncCheckName: "RESULTTEXTFO",
      croNumber: "",
      crimeOffenceReferenceNumber: "",
      ownerCode: "01YZ",
      personUrn: "00/449851Z",
      courtCaseReference: "97/1626/008395Q",
      court: {
        courtIdentityType: "code",
        courtCode: "2576"
      },
      dateOfConviction: "2011-09-26",
      defendant: {
        defendantType: "individual",
        defendantFirstNames: ["OFFENCES"],
        defendantLastName: "DUPLICATE"
      },
      offences: [
        {
          courtOffenceSequenceNumber: 1,
          cjsOffenceCode: "TH68006",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-09-26",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 1015,
              disposalFine: {
                amount: 300
              }
            },
            {
              disposalCode: 1016
            }
          ],
          offenceId: "a158e262-3d93-4272-9b8f-8266f02fe23e"
        },
        {
          courtOffenceSequenceNumber: 2,
          cjsOffenceCode: "TH68006",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-09-26",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 1015,
              disposalFine: {
                amount: 3000
              }
            },
            {
              disposalCode: 1016
            }
          ],
          offenceId: "8343b72b-d1e0-417c-96b6-5dce769da3d7"
        }
      ]
    }
  })
]
