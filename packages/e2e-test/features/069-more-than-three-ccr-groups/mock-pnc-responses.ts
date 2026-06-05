import type Bichard from "../../utils/world"

export default (ncm: string, { policeApi }: Bichard) => [
  policeApi.mockEnquiryFromNcm(ncm),
  policeApi.mockUpdate("CXU02", {
    courtCaseId: "c4ca4238a0b923820dcc509a6f75849b",
    expectedRequest: {
      pncCheckName: "LOMAX",
      croNumber: "",
      crimeOffenceReferenceNumber: "",
      ownerCode: "01YZ",
      longPersonUrn: "2000/410769X",
      courtCaseReference: "97/1626/018395Q",
      court: {
        courtIdentityType: "code",
        courtCode: "2576"
      },
      dateOfConviction: "2009-06-07",
      defendant: {
        defendantType: "individual",
        defendantFirstNames: ["DAVID"],
        defendantLastName: "LOMAX"
      },
      offences: [
        {
          courtOffenceSequenceNumber: 1,
          cjsOffenceCode: "TH68037",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2009-06-07",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 1002,
              disposalDuration: {
                units: "months",
                count: 14
              }
            }
          ],
          offenceId: "3d6026ea-9175-4588-a0d3-19c13fad7bad"
        }
      ]
    }
  })
]
