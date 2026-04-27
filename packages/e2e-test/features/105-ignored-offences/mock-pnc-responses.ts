import type Bichard from "../../utils/world"

export default (ncm: string, { policeApi }: Bichard) => [
  policeApi.mockEnquiryFromNcm(ncm),
  policeApi.mockUpdate("CXU02", {
    expectedRequest: {
      pncCheckName: "SOMEOFFENCES",
      croNumber: "",
      crimeOffenceReferenceNumber: "",
      ownerCode: "01YZ",
      personUrn: "00/410844D",
      courtCaseReference: "97/1626/008395Q",
      court: {
        courtIdentityType: "code",
        courtCode: "2576"
      },
      dateOfConviction: "2011-10-01",
      defendant: {
        defendantType: "individual",
        defendantFirstNames: ["IGNORE"],
        defendantLastName: "SOMEOFFENCES"
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
            }
          ],
          offenceId: "f5b21037-0925-4132-94f7-40605894f5c3"
        },
        {
          courtOffenceSequenceNumber: 2,
          cjsOffenceCode: "TH68012",
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
          offenceId: "cd642de5-3c2e-428b-b047-44212c207992"
        }
      ]
    }
  })
]
