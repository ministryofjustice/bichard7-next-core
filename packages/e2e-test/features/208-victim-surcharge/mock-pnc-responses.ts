import type Bichard from "../../utils/world"

export default (ncm: string, { policeApi }: Bichard) => [
  policeApi.mockEnquiryFromNcm(ncm),
  policeApi.mockUpdate("CXU02", {
    expectedRequest: {
      pncCheckName: "TORRENCE",
      croNumber: "",
      crimeOffenceReferenceNumber: "",
      ownerCode: "01YZ",
      personUrn: "00/356Z",
      courtCaseReference: "97/1626/008395Q",
      court: {
        courtIdentityType: "code",
        courtCode: "2576"
      },
      dateOfConviction: "2009-01-25",
      defendant: {
        defendantType: "individual",
        defendantFirstNames: ["JACK"],
        defendantLastName: "TORRENCE"
      },
      offences: [
        {
          courtOffenceSequenceNumber: 1,
          cjsOffenceCode: "CD71039",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2009-01-25",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 1015,
              disposalFine: {
                amount: 50
              }
            },
            {
              disposalCode: 3011,
              disposalFine: {
                amount: 50
              }
            },
            {
              disposalCode: 3011,
              disposalFine: {
                amount: 15
              }
            },
            {
              disposalCode: 3117,
              disposalFine: {
                amount: 40
              }
            }
          ],
          offenceId: "50f37f67-47b9-40f9-b827-9cc694e50e45"
        }
      ]
    }
  })
]
