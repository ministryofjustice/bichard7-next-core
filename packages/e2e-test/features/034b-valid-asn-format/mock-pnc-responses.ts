import type Bichard from "../../utils/world"

export default (ncm: string, { policeApi }: Bichard) => [
  policeApi.mockEnquiryFromNcm(ncm),
  policeApi.mockUpdate("CXU02", {
    expectedRequest: {
      pncCheckName: "BAKER",
      croNumber: "",
      crimeOffenceReferenceNumber: "",
      ownerCode: "01YZ",
      personUrn: "00/410792X",
      courtCaseReference: "97/1626/008395Q",
      court: {
        courtIdentityType: "code",
        courtCode: "2576"
      },
      dateOfConviction: "2011-09-25",
      defendant: {
        defendantType: "individual",
        defendantFirstNames: ["JORDAN"],
        defendantLastName: "BAKER"
      },
      offences: [
        {
          courtOffenceSequenceNumber: 1,
          cjsOffenceCode: "RT88191",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-09-25",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 1015,
              disposalFine: {
                amount: 45
              }
            }
          ],
          offenceId: "9f0464f7-23e6-4450-a120-c08a6e1ee59d"
        }
      ]
    }
  })
]
