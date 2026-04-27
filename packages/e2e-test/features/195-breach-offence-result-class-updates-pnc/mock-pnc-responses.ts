import type Bichard from "../../utils/world"

export default (ncm: string, { policeApi }: Bichard) => [
  policeApi.mockEnquiryFromNcm(ncm),
  policeApi.mockUpdate("CXU02", {
    expectedRequest: {
      pncCheckName: "NORTHERS",
      croNumber: "",
      crimeOffenceReferenceNumber: "",
      ownerCode: "01YZ",
      personUrn: "00/415362P",
      courtCaseReference: "97/1626/008395Q",
      court: {
        courtIdentityType: "code",
        courtCode: "2576"
      },
      dateOfConviction: "2011-10-26",
      defendant: {
        defendantType: "individual",
        defendantFirstNames: ["THETUBE"],
        defendantLastName: "NORTHERS"
      },
      offences: [
        {
          courtOffenceSequenceNumber: 1,
          cjsOffenceCode: "CJ03510",
          plea: "Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-10-26",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 1015,
              disposalFine: {
                amount: 100
              }
            }
          ],
          offenceId: "2de753f8-c4a5-4b1c-9372-2380af47ce35"
        }
      ]
    }
  })
]
