import type Bichard from "../../utils/world"

export default (ncm: string, { policeApi }: Bichard) => [
  policeApi.mockEnquiryFromNcm(ncm),
  policeApi.mockUpdate("CXU02", {
    expectedRequest: {
      pncCheckName: "TEARCE",
      croNumber: "",
      crimeOffenceReferenceNumber: "",
      ownerCode: "01YZ",
      personUrn: "00/410800F",
      courtCaseReference: "97/1626/008395Q",
      court: {
        courtIdentityType: "code",
        courtCode: "1910"
      },
      dateOfConviction: "2011-09-26",
      defendant: {
        defendantType: "individual",
        defendantFirstNames: ["WALLACE"],
        defendantLastName: "TEARCE"
      },
      offences: [
        {
          courtOffenceSequenceNumber: 1,
          cjsOffenceCode: "TH68036",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-09-26",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 1116,
              disposalEffectiveDate: "2012-09-26"
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
          offenceId: "5a2beb8d-9e7d-4003-b3a7-925511d0ff91"
        }
      ]
    }
  })
]
