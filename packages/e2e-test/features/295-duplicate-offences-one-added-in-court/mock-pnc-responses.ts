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
          offenceId: "316d1f20-e1b4-4008-9e96-93ffc570c704"
        }
      ],
      additionalArrestOffences: [
        {
          asn: "14/01ZD/01/449852A",
          additionalOffences: [
            {
              courtOffenceSequenceNumber: 0,
              offenceCode: {
                offenceCodeType: "cjs",
                cjsOffenceCode: "TH68006"
              },
              committedOnBail: false,
              plea: "Not Guilty",
              adjudication: "Guilty",
              dateOfSentence: "2011-09-26",
              offenceTic: 0,
              offenceStartDate: "2010-11-28",
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
              locationFsCode: "01ZD",
              locationText: {
                locationText: "KINGSTON HIGH STREET"
              }
            }
          ]
        }
      ]
    }
  })
]
