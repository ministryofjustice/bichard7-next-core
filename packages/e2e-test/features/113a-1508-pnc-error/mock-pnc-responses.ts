import type Bichard from "../../utils/world"

export default (ncm: string, { policeApi }: Bichard) => [
  policeApi.mockEnquiryFromNcm(ncm),
  policeApi.mockUpdate("CXU02", {
    expectedRequest: {
      pncCheckName: "TOCONTINUEA",
      croNumber: "",
      crimeOffenceReferenceNumber: "",
      ownerCode: "01YZ",
      personUrn: "00/410759L",
      courtCaseReference: "97/1626/008395Q",
      court: {
        courtIdentityType: "code",
        courtCode: "2576"
      },
      dateOfConviction: "2011-09-26",
      defendant: {
        defendantType: "individual",
        defendantFirstNames: ["ORDER"],
        defendantLastName: "TOCONTINUEA"
      },
      offences: [
        {
          courtOffenceSequenceNumber: 1,
          cjsOffenceCode: "CJ88116",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-09-26",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 1115,
              disposalDuration: {
                units: "months",
                count: 4
              },
              disposalQualifiers: ["S"],
              disposalQualifierDuration: {
                units: "months",
                count: 12
              }
            }
          ],
          offenceId: "e8dda102-08aa-41d2-b2ad-4a2170c6cb96"
        }
      ]
    },
    count: 1
  })
]
