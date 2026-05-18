import type Bichard from "../../utils/world"

export default (ncm: string, { policeApi }: Bichard) => [
  policeApi.mockEnquiryFromNcm(ncm),
  policeApi.mockUpdate("CXU02", {
    expectedRequest: {
      pncCheckName: "ALLOCATION",
      croNumber: "",
      crimeOffenceReferenceNumber: "",
      ownerCode: "01YZ",
      personUrn: "2000/445099L",
      courtCaseReference: "97/1626/008395Q",
      court: {
        courtIdentityType: "code",
        courtCode: "1971"
      },
      dateOfConviction: "2008-09-26",
      defendant: {
        defendantType: "individual",
        defendantFirstNames: ["TRIGGER"],
        defendantLastName: "ALLOCATION"
      },
      offences: [
        {
          courtOffenceSequenceNumber: 1,
          cjsOffenceCode: "TH68006",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2008-09-26",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 3095,
              disposalDuration: {
                units: "months",
                count: 14
              }
            }
          ],
          offenceId: "7afeddf7-43e9-4e1a-b299-d267e1aa257b"
        },
        {
          courtOffenceSequenceNumber: 2,
          cjsOffenceCode: "TH68151",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2008-09-26",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 3052,
              disposalDuration: {
                units: "months",
                count: 11
              }
            }
          ],
          offenceId: "11c81a5f-4a4c-4506-a353-b5a599990eee"
        },
        {
          courtOffenceSequenceNumber: 3,
          cjsOffenceCode: "RT88191",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2008-09-26",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 3088,
              disposalDuration: {
                units: "months",
                count: 12
              }
            }
          ],
          offenceId: "f3576738-0967-4807-b068-ab88ee59ed6a"
        },
        {
          courtOffenceSequenceNumber: 4,
          cjsOffenceCode: "TH68006",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2008-09-26",
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
          offenceId: "dc9381b9-9104-420c-9606-c63e4ae02b02"
        }
      ]
    }
  })
]
