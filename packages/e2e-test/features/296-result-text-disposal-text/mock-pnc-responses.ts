import type Bichard from "../../utils/world"

export default (ncm: string, { policeApi }: Bichard) => [
  policeApi.mockEnquiryFromNcm(ncm),
  policeApi.mockUpdate("CXU02", {
    expectedRequest: {
      pncCheckName: "RESULTTEXTIS",
      croNumber: "",
      crimeOffenceReferenceNumber: "",
      ownerCode: "01YZ",
      personUrn: "00/449847V",
      courtCaseReference: "97/1626/008395Q",
      court: {
        courtIdentityType: "code",
        courtCode: "2576"
      },
      dateOfConviction: "2011-09-26",
      defendant: {
        defendantType: "individual",
        defendantFirstNames: ["DUPLICATEOFFENCES"],
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
          offenceId: "d309d2b7-15ac-468f-9139-a1a8421859ee"
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
          offenceId: "5d56facd-3d6e-4ee4-97fe-f00a814183f2"
        }
      ]
    }
  })
]
