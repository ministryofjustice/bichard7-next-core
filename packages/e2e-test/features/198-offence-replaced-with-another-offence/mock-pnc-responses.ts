import type Bichard from "../../utils/world"

export default (ncm: string, { policeApi }: Bichard) => [
  policeApi.mockEnquiryFromNcm(ncm),
  policeApi.mockUpdate("CXU02", {
    expectedRequest: {
      pncCheckName: "DISTRICTUS",
      croNumber: "",
      crimeOffenceReferenceNumber: "",
      ownerCode: "01YZ",
      personUrn: "00/415365T",
      courtCaseReference: "97/1626/008395Q",
      court: {
        courtIdentityType: "code",
        courtCode: "2576"
      },
      dateOfConviction: "2011-09-26",
      defendant: {
        defendantType: "individual",
        defendantFirstNames: ["THETUBE"],
        defendantLastName: "DISTRICTUS"
      },
      carryForward: {
        appearanceDate: "2011-10-28",
        court: {
          courtIdentityType: "code",
          courtCode: "2576"
        }
      },
      offences: [
        {
          courtOffenceSequenceNumber: 1,
          cjsOffenceCode: "TH68006",
          plea: "No Plea Taken",
          adjudication: "Non-Conviction",
          dateOfSentence: "2011-09-26",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 2063
            }
          ],
          offenceId: "e3483edd-7fec-4553-8c69-8edc7fc38b1d"
        }
      ],
      additionalArrestOffences: [
        {
          asn: "11/01ZD/01/415365T",
          additionalOffences: [
            {
              courtOffenceSequenceNumber: 0,
              offenceCode: {
                offenceCodeType: "cjs",
                cjsOffenceCode: "TH68072"
              },
              committedOnBail: false,
              offenceTic: 0,
              offenceStartDate: "2010-11-28",
              disposalResults: [
                {
                  disposalCode: 2059
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
  }),
  policeApi.mockUpdate("CXU01", {
    expectedRequest: {
      pncCheckName: "DISTRICTUS",
      croNumber: "",
      arrestSummonsNumber: "11/01ZD/01/415365T",
      crimeOffenceReferenceNo: "",
      remandResult: "B",
      remandLocationFfss: "",
      ownerCode: "01YZ",
      personUrn: "00/415365T",
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
        date: "2011-10-28",
        court: {
          courtIdentityType: "code",
          courtCode: "2576"
        }
      }
    }
  })
]
