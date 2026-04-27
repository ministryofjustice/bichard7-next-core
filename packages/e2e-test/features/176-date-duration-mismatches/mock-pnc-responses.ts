import type Bichard from "../../utils/world"

export default (ncm: string, { policeApi }: Bichard) => [
  policeApi.mockEnquiryFromNcm(ncm),
  policeApi.mockUpdate("CXU02", {
    expectedRequest: {
      pncCheckName: "DIBBLEY",
      croNumber: "",
      crimeOffenceReferenceNumber: "",
      ownerCode: "01YZ",
      personUrn: "00/410922N",
      courtCaseReference: "97/1626/008395Q",
      court: {
        courtIdentityType: "code",
        courtCode: "2576"
      },
      dateOfConviction: "2011-09-26",
      defendant: {
        defendantType: "individual",
        defendantFirstNames: ["MARCUS"],
        defendantLastName: "DIBBLEY"
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
              disposalCode: 1015,
              disposalFine: {
                amount: 100
              }
            },
            {
              disposalCode: 1002,
              disposalDuration: {
                units: "months",
                count: 4
              }
            }
          ],
          offenceId: "41a05dba-74a7-4d1d-b987-17a3c2a44a85"
        },
        {
          courtOffenceSequenceNumber: 2,
          cjsOffenceCode: "TH68006",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-09-26",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 1015,
              disposalFine: {
                amount: 100
              }
            },
            {
              disposalCode: 1002,
              disposalDuration: {
                units: "months",
                count: 5
              }
            }
          ],
          offenceId: "9db51b32-8b64-41a1-b95a-772de9c29f42"
        },
        {
          courtOffenceSequenceNumber: 3,
          cjsOffenceCode: "TH68006",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-09-26",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 1015,
              disposalFine: {
                amount: 100
              }
            },
            {
              disposalCode: 1002,
              disposalDuration: {
                units: "months",
                count: 5
              }
            }
          ],
          offenceId: "84c940c5-13ee-478f-a910-3d1b07ea8493"
        }
      ]
    }
  })
]
