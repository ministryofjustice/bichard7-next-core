import type Bichard from "../../utils/world"

export default (ncm: string, { policeApi }: Bichard) => [
  policeApi.mockEnquiryFromNcm(ncm),
  policeApi.mockUpdate("CXU02", {
    expectedRequest: {
      pncCheckName: "RESULTTEXTIS",
      croNumber: "",
      crimeOffenceReferenceNumber: "",
      ownerCode: "01YZ",
      personUrn: "00/449852A",
      courtCaseReference: "97/1626/008395Q",
      court: {
        courtIdentityType: "code",
        courtCode: "2576"
      },
      dateOfConviction: "2011-09-26",
      defendant: {
        defendantType: "individual",
        defendantFirstNames: ["DUPLICATEOFFENCEADDEDINCOURT"],
        defendantLastName: "RESULTTEXTISUSED"
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
              disposalCode: 1100,
              disposalDuration: {
                units: "weeks",
                count: 6
              },
              disposalQualifiers: ["BA"],
              disposalText: "EXCLUDED FROM ALL LICENSED PREMISES WITHIN DIDLY DISTRICT COUNC+"
            },
            {
              disposalCode: 3041,
              disposalDuration: {
                units: "months",
                count: 12
              },
              disposalText: "EXCLUDED FROM SEAWORLD PUBLIC HOUSE, SEAWORLD, PICKERING, NORTH+"
            }
          ],
          offenceId: "a8616f07-a618-4a67-862c-e7ddd5481306"
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
              disposalCode: 1100,
              disposalDuration: {
                units: "weeks",
                count: 6
              },
              disposalQualifiers: ["BA"],
              disposalText: "EXCLUDED FROM ALL LICENSED PREMISES WITHIN IDLY DISTRICT COUNCI+"
            },
            {
              disposalCode: 3041,
              disposalDuration: {
                units: "months",
                count: 12
              },
              disposalText: "EXCLUDED FROM LANDWORLD PUBLIC HOUSE, LANDWORLD, PICKERING, NOR+"
            }
          ],
          offenceId: "c5fe1598-5a25-4908-95a4-fa9a9e2d75ea"
        }
      ]
    }
  })
]
