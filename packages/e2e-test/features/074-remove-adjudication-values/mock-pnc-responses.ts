import type Bichard from "../../utils/world"

export default (ncm: string, { policeApi }: Bichard) => [
  policeApi.mockEnquiryFromNcm(ncm),
  policeApi.mockUpdate("CXU01", {
    expectedRequest: {
      pncCheckName: "STRIPCONVICT",
      croNumber: "",
      arrestSummonsNumber: "11/01ZD/01/410829M",
      crimeOffenceReferenceNo: "",
      remandResult: "B",
      remandLocationFfss: "",
      ownerCode: "01YZ",
      personUrn: "00/410829M",
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
        date: "2011-10-08",
        court: {
          courtIdentityType: "code",
          courtCode: "2576"
        }
      }
    }
  }),
  policeApi.mockUpdate("CXU02", {
    expectedRequest: {
      pncCheckName: "STRIPCONVICT",
      croNumber: "",
      crimeOffenceReferenceNumber: "",
      ownerCode: "01YZ",
      personUrn: "00/410829M",
      courtCaseReference: "97/1626/008395Q",
      court: {
        courtIdentityType: "code",
        courtCode: "2576"
      },
      dateOfConviction: "2011-09-26",
      defendant: {
        defendantType: "individual",
        defendantFirstNames: ["MISTER"],
        defendantLastName: "STRIPCONVICTION"
      },
      carryForward: {
        appearanceDate: "2011-10-08",
        court: {
          courtIdentityType: "code",
          courtCode: "2576"
        }
      },
      referToCourtCase: {
        reference: "01ZD/0300108"
      },
      offences: [
        {
          courtOffenceSequenceNumber: 1,
          cjsOffenceCode: "TH68006",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 2059
            }
          ],
          offenceId: "dedc730b-598a-4265-b909-d2966316df05"
        },
        {
          courtOffenceSequenceNumber: 2,
          cjsOffenceCode: "TH68151",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 2059
            }
          ],
          offenceId: "2c154668-02b8-41fd-8171-9f171bca4636"
        },
        {
          courtOffenceSequenceNumber: 3,
          cjsOffenceCode: "RT88191",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 2060
            }
          ],
          offenceId: "11ce0589-6f97-4db1-86f5-e2c100b0b722"
        }
      ],
      additionalArrestOffences: [
        {
          asn: "11/01ZD/01/410829M",
          additionalOffences: [
            {
              courtOffenceSequenceNumber: 0,
              offenceCode: {
                offenceCodeType: "cjs",
                cjsOffenceCode: "TH68072"
              },
              committedOnBail: false,
              plea: "Not Guilty",
              adjudication: "Guilty",
              dateOfSentence: "2011-09-26",
              offenceTic: 0,
              offenceStartDate: "2010-11-28",
              disposalResults: [
                {
                  disposalCode: 1015,
                  disposalFine: {
                    amount: 200
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
