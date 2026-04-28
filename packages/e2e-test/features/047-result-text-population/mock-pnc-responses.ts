import type Bichard from "../../utils/world"

export default (ncm: string, { policeApi }: Bichard) => [
  policeApi.mockEnquiryFromNcm(ncm),
  policeApi.mockUpdate("CXU02", {
    expectedRequest: {
      pncCheckName: "RTTOO",
      croNumber: "",
      crimeOffenceReferenceNumber: "",
      ownerCode: "01YZ",
      personUrn: "00/410798D",
      courtCaseReference: "97/1626/008395Q",
      court: {
        courtIdentityType: "code",
        courtCode: "2576"
      },
      dateOfConviction: "2011-09-26",
      defendant: {
        defendantType: "individual",
        defendantFirstNames: ["UPDATE"],
        defendantLastName: "RTTOO"
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
          offenceId: "01f0e4cf-eff9-4253-8f1f-0a64198dc516"
        }
      ]
    }
  })
]
