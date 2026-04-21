import type Bichard from "../../utils/world"

export default (ncm: string, { policeApi }: Bichard) => [
  policeApi.mockEnquiryFromNcm(ncm),
  policeApi.mockUpdate("CXU01", {
    expectedRequest: {
      pncCheckName: "THREEZEROFIV",
      croNumber: "",
      arrestSummonsNumber: "11/01ZD/01/500008W",
      crimeOffenceReferenceNo: "",
      remandResult: "C",
      remandLocationFfss: "",
      ownerCode: "01YZ",
      personUrn: "00/500008W",
      remandDate: "2011-09-26",
      appearanceResult: "remanded-in-custody",
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
      pncCheckName: "THREEZEROFIV",
      croNumber: "",
      crimeOffenceReferenceNumber: "",
      ownerCode: "01YZ",
      personUrn: "00/500008W",
      courtCaseReference: "97/1626/008395Q",
      court: {
        courtIdentityType: "code",
        courtCode: "2576"
      },
      dateOfConviction: "2011-09-26",
      defendant: {
        defendantType: "individual",
        defendantFirstNames: ["ADJWITHJUDGE"],
        defendantLastName: "THREEZEROFIVETWO"
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
              disposalCode: 4004,
              disposalEffectiveDate: "2012-02-01"
            }
          ],
          offenceId: "b49a5cf9-8407-4a1f-ac5b-e1fd83790faf"
        }
      ]
    }
  })
]
