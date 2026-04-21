import type Bichard from "../../utils/world"

export default (ncm: string, { policeApi }: Bichard) => [
  policeApi.mockEnquiryFromNcm(ncm),
  policeApi.mockUpdate("CXU02", {
    expectedRequest: {
      pncCheckName: "ALLOCATION",
      croNumber: "",
      crimeOffenceReferenceNumber: "",
      ownerCode: "36YZ",
      personUrn: "00/377244A",
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
          offenceId: "9339947b-6dfd-4b8d-b499-ca843d626756"
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
          offenceId: "837d178c-d10e-4d32-8590-9f637e681c3d"
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
          offenceId: "7292b638-a2d0-4ced-8582-64f4ba293df6"
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
          offenceId: "b89f4386-6cc9-412a-82c0-3b52c1b19f84"
        }
      ]
    }
  })
]
