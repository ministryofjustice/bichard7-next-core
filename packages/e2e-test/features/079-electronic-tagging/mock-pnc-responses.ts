import type Bichard from "../../utils/world"

export default (ncm: string, { policeApi }: Bichard) => [
  policeApi.mockEnquiryFromNcm(ncm),
  policeApi.mockUpdate("CXU02", {
    expectedRequest: {
      pncCheckName: "BEN",
      croNumber: "",
      crimeOffenceReferenceNumber: "",
      ownerCode: "01YZ",
      personUrn: "00/410834T",
      courtCaseReference: "97/1626/008395Q",
      court: {
        courtIdentityType: "code",
        courtCode: "2576"
      },
      dateOfConviction: "2011-09-26",
      defendant: {
        defendantType: "individual",
        defendantFirstNames: ["MISTER"],
        defendantLastName: "BEN"
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
              disposalCode: 1115,
              disposalDuration: {
                units: "weeks",
                count: 2
              },
              disposalQualifiers: ["S"],
              disposalQualifierDuration: {
                units: "weeks",
                count: 12
              }
            },
            {
              disposalCode: 3105,
              disposalDuration: {
                units: "weeks",
                count: 12
              },
              disposalQualifiers: ["BA"]
            }
          ],
          offenceId: "a6a16c5b-d37e-4df6-9f75-5dba951851f0"
        }
      ]
    }
  })
]
