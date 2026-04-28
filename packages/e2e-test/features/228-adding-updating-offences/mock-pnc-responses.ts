import type Bichard from "../../utils/world"

export default (ncm: string, { policeApi }: Bichard) => [
  policeApi.mockEnquiryFromNcm(ncm),
  policeApi.mockUpdate("CXU01", {
    expectedRequest: {
      pncCheckName: "ADDEDOFFENCE",
      croNumber: "",
      arrestSummonsNumber: "11/01ZD/01/445118H",
      crimeOffenceReferenceNo: "",
      remandResult: "B",
      remandLocationFfss: "",
      ownerCode: "01YZ",
      personUrn: "00/445118H",
      remandDate: "2011-10-01",
      appearanceResult: "remanded-on-bail",
      bailConditions: [],
      currentAppearance: {
        court: {
          courtIdentityType: "code",
          courtCode: "2576"
        }
      },
      nextAppearance: {
        date: "2012-02-01",
        court: {
          courtIdentityType: "code",
          courtCode: "2576"
        }
      }
    }
  }),
  policeApi.mockUpdate("CXU02", {
    expectedRequest: {
      pncCheckName: "ADDEDOFFENCE",
      croNumber: "",
      crimeOffenceReferenceNumber: "",
      ownerCode: "01YZ",
      personUrn: "00/445118H",
      courtCaseReference: "97/1626/008395Q",
      court: {
        courtIdentityType: "code",
        courtCode: "2576"
      },
      dateOfConviction: "2011-10-01",
      defendant: {
        defendantType: "individual",
        defendantFirstNames: ["NOPNCADJ"],
        defendantLastName: "ADDEDOFFENCEJWFTHREE"
      },
      carryForward: {
        appearanceDate: "2012-02-01",
        court: {
          courtIdentityType: "code",
          courtCode: "2576"
        }
      },
      offences: [
        {
          courtOffenceSequenceNumber: 1,
          cjsOffenceCode: "TH68010",
          offenceTic: 0,
          plea: "NOT GUILTY",
          disposalResults: [
            {
              disposalCode: 2059
            }
          ],
          offenceId: "9656423b-ef48-4a62-89c3-5d1738c82122"
        }
      ],
      additionalArrestOffences: [
        {
          asn: "11/01ZD/01/445118H",
          additionalOffences: [
            {
              courtOffenceSequenceNumber: 0,
              offenceCode: {
                offenceCodeType: "cjs",
                cjsOffenceCode: "TH68012"
              },
              committedOnBail: false,
              plea: "Not Guilty",
              adjudication: "Guilty",
              dateOfSentence: "2011-10-01",
              offenceTic: 0,
              offenceStartDate: "2010-09-25",
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
                locationText: "1 KINGSTON HIGH STREET"
              }
            }
          ]
        }
      ]
    }
  })
]
