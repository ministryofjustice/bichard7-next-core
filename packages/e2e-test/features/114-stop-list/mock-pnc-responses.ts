import type Bichard from "../../utils/world"

export default (ncm: string, { policeApi }: Bichard) => [
  policeApi.mockEnquiryFromNcm(ncm),
  policeApi.mockUpdate("CXU02", {
    expectedRequest: {
      pncCheckName: "QUALIFIERS",
      croNumber: "",
      crimeOffenceReferenceNumber: "",
      ownerCode: "01YZ",
      personUrn: "00/410850K",
      courtCaseReference: "97/1626/008395Q",
      court: {
        courtIdentityType: "code",
        courtCode: "2576"
      },
      dateOfConviction: "2011-09-26",
      defendant: {
        defendantType: "individual",
        defendantFirstNames: ["RESULTCODE"],
        defendantLastName: "QUALIFIERS"
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
              disposalCode: 1002,
              disposalDuration: {
                units: "months",
                count: 12
              },
              disposalQualifiers: ["F"]
            },
            {
              disposalCode: 1081,
              disposalDuration: {
                units: "months",
                count: 12
              },
              disposalQualifiers: ["F"]
            }
          ],
          offenceId: "c614b960-99b2-47c0-8aa2-81757a7171df"
        },
        {
          courtOffenceSequenceNumber: 2,
          cjsOffenceCode: "TH68151",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-09-26",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 1002,
              disposalDuration: {
                units: "months",
                count: 10
              },
              disposalQualifiers: ["F"]
            },
            {
              disposalCode: 1081,
              disposalDuration: {
                units: "months",
                count: 10
              },
              disposalQualifiers: ["F"]
            }
          ],
          offenceId: "8ecb6557-0bae-4864-9911-9c632ec6ac03"
        }
      ]
    }
  })
]
