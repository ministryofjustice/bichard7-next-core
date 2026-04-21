import type Bichard from "../../utils/world"

export default (ncm: string, { policeApi }: Bichard) => [
  policeApi.mockEnquiryFromNcm(ncm),
  policeApi.mockUpdate("CXU01", {
    expectedRequest: {
      pncCheckName: "TWOZEROFIVEZ",
      croNumber: "",
      arrestSummonsNumber: "11/01ZD/01/500001N",
      crimeOffenceReferenceNo: "",
      remandResult: "B",
      remandLocationFfss: "",
      ownerCode: "01YZ",
      personUrn: "00/500001N",
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
      pncCheckName: "TWOZEROFIVEZ",
      croNumber: "",
      crimeOffenceReferenceNumber: "",
      ownerCode: "01YZ",
      personUrn: "00/500001N",
      courtCaseReference: "97/1626/008395Q",
      court: {
        courtIdentityType: "code",
        courtCode: "2576"
      },
      dateOfConviction: "2011-09-26",
      defendant: {
        defendantType: "individual",
        defendantFirstNames: ["NOPNCUPDATE"],
        defendantLastName: "TWOZEROFIVEZERO"
      },
      referToCourtCase: {
        reference: "01ZD/0300508"
      },
      offences: [
        {
          courtOffenceSequenceNumber: 1,
          cjsOffenceCode: "TH68006",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 2060
            }
          ],
          offenceId: "ef1b8ab0-f733-4408-ba08-61e71fc36711"
        }
      ],
      additionalArrestOffences: [
        {
          asn: "11/01ZD/01/500001N",
          additionalOffences: [
            {
              courtOffenceSequenceNumber: 0,
              offenceCode: {
                offenceCodeType: "cjs",
                cjsOffenceCode: "TH68151"
              },
              committedOnBail: false,
              plea: "Not Guilty",
              adjudication: "Guilty",
              dateOfSentence: "2011-09-26",
              offenceTic: 0,
              offenceStartDate: "2010-11-28",
              disposalResults: [
                {
                  disposalCode: 4004,
                  disposalEffectiveDate: "2012-02-01"
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
