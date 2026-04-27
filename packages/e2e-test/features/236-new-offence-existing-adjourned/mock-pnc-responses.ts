import type Bichard from "../../utils/world"

export default (ncm: string, { policeApi }: Bichard) => [
  policeApi.mockEnquiryFromNcm(ncm),
  policeApi.mockUpdate("CXU01", {
    expectedRequest: {
      pncCheckName: "OFFENCEADDED",
      croNumber: "",
      arrestSummonsNumber: "12/01ZD/01/445741J",
      crimeOffenceReferenceNo: "",
      remandResult: "B",
      remandLocationFfss: "",
      ownerCode: "01YZ",
      personUrn: "00/445741J",
      remandDate: "2011-09-26",
      appearanceResult: "remanded-on-bail",
      bailConditions: [],
      currentAppearance: {
        court: {
          courtIdentityType: "code",
          courtCode: "2576"
        }
      },
      nextAppearance: {
        date: "2011-10-26",
        court: {
          courtIdentityType: "code",
          courtCode: "2576"
        }
      }
    }
  }),
  policeApi.mockUpdate("CXU02", {
    expectedRequest: {
      pncCheckName: "OFFENCEADDED",
      croNumber: "",
      crimeOffenceReferenceNumber: "",
      ownerCode: "01YZ",
      personUrn: "00/445741J",
      courtCaseReference: "97/1626/008395Q",
      court: {
        courtIdentityType: "code",
        courtCode: "2576"
      },
      dateOfConviction: "2011-09-26",
      defendant: {
        defendantType: "individual",
        defendantFirstNames: ["APJAWJ"],
        defendantLastName: "OFFENCEADDED"
      },
      carryForward: {
        appearanceDate: "2011-10-26",
        court: {
          courtIdentityType: "code",
          courtCode: "2576"
        }
      },
      offences: [
        {
          courtOffenceSequenceNumber: 1,
          cjsOffenceCode: "TH68006",
          offenceTic: 0,
          plea: "NOT GUILTY",
          disposalResults: [
            {
              disposalCode: 2059
            }
          ],
          offenceId: "5058c913-b146-476b-8339-44ae3e0019c0"
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
              disposalCode: 4047,
              disposalEffectiveDate: "2011-10-26"
            }
          ],
          offenceId: "f12ac5a0-8c8f-45a0-9310-6cf8abb2e6cd"
        }
      ],
      additionalArrestOffences: [
        {
          asn: "12/01ZD/01/445741J",
          additionalOffences: [
            {
              courtOffenceSequenceNumber: 0,
              offenceCode: {
                offenceCodeType: "cjs",
                cjsOffenceCode: "TH68010"
              },
              committedOnBail: false,
              plea: "Not Guilty",
              adjudication: "Guilty",
              dateOfSentence: "2011-09-26",
              offenceTic: 0,
              offenceStartDate: "2010-11-29",
              disposalResults: [
                {
                  disposalCode: 1015,
                  disposalFine: {
                    amount: 300
                  }
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
