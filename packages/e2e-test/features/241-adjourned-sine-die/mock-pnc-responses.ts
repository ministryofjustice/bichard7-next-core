import type Bichard from "../../utils/world"

export default (ncm: string, { policeApi }: Bichard) => [
  policeApi.mockEnquiryFromNcm(ncm),
  policeApi.mockUpdate("CXU02", {
    expectedRequest: {
      pncCheckName: "ADJSINEDIE",
      croNumber: "",
      crimeOffenceReferenceNumber: "",
      ownerCode: "01YZ",
      personUrn: "00/445739G",
      courtCaseReference: "97/1626/008395Q",
      court: {
        courtIdentityType: "code",
        courtCode: "2576"
      },
      dateOfConviction: "2011-09-25",
      defendant: {
        defendantType: "individual",
        defendantFirstNames: ["NOCONVICTIONDATE"],
        defendantLastName: "ADJSINEDIE"
      },
      offences: [
        {
          courtOffenceSequenceNumber: 1,
          cjsOffenceCode: "TH68006",
          plea: "Not Guilty",
          adjudication: "Non-Conviction",
          dateOfSentence: "2011-09-25",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 2007
            }
          ],
          offenceId: "933db987-7683-47a2-b3e8-3de220d33614"
        },
        {
          courtOffenceSequenceNumber: 2,
          cjsOffenceCode: "TH68151",
          plea: "Not Guilty",
          adjudication: "Non-Conviction",
          dateOfSentence: "2011-09-25",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 2007
            }
          ],
          offenceId: "771a5e80-7987-4599-9f07-e4170eb5ee58"
        },
        {
          courtOffenceSequenceNumber: 3,
          cjsOffenceCode: "RT88191",
          plea: "Not Guilty",
          adjudication: "Non-Conviction",
          dateOfSentence: "2011-09-25",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 2007
            }
          ],
          offenceId: "5f4c76bc-6484-4c62-92eb-53a3f9161c32"
        }
      ]
    }
  })
]
