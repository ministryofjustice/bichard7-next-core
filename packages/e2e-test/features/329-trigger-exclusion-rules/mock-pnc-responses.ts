import type Bichard from "../../utils/world"

export default (ncm: string, { policeApi }: Bichard) => [
  policeApi.mockEnquiryFromNcm(ncm),
  policeApi.mockUpdate("CXU02", {
    expectedRequest: {
      pncCheckName: "TFILTERONE",
      croNumber: "",
      crimeOffenceReferenceNumber: "",
      ownerCode: "01YZ",
      personUrn: "00/410818A",
      courtCaseReference: "97/1626/008395Q",
      court: {
        courtIdentityType: "code",
        courtCode: "2576"
      },
      dateOfConviction: "2008-09-28",
      defendant: {
        defendantType: "individual",
        defendantFirstNames: ["TRIGGER"],
        defendantLastName: "TFILTERONE"
      },
      offences: [
        {
          courtOffenceSequenceNumber: 1,
          cjsOffenceCode: "TH68023",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2008-09-28",
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
              disposalCode: 3047,
              disposalText: "UNTIL FURTHER ORDER"
            }
          ],
          offenceId: "52ed6606-0485-4614-9bd3-6d90c5950a81"
        }
      ]
    }
  })
]
