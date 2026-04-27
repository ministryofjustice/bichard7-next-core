import type Bichard from "../../utils/world"

export default (ncm: string, { policeApi }: Bichard) => [
  policeApi.mockEnquiryFromNcm(ncm),
  policeApi.mockUpdate("CXU01", {
    expectedRequest: {
      pncCheckName: "REMANDTEST",
      croNumber: "",
      arrestSummonsNumber: "11/01ZD/01/410865B",
      crimeOffenceReferenceNo: "",
      remandResult: "B",
      remandLocationFfss: "",
      ownerCode: "01YZ",
      personUrn: "00/410865B",
      remandDate: "2011-04-25",
      appearanceResult: "remanded-on-bail",
      bailConditions: [],
      currentAppearance: {
        court: {
          courtIdentityType: "code",
          courtCode: "2576"
        }
      },
      nextAppearance: {
        date: "2011-12-08",
        court: {
          courtIdentityType: "code",
          courtCode: "0453"
        }
      }
    }
  }),
  policeApi.mockUpdate("CXU02", {
    expectedRequest: {
      pncCheckName: "REMANDTEST",
      croNumber: "",
      crimeOffenceReferenceNumber: "",
      ownerCode: "01YZ",
      personUrn: "00/410865B",
      courtCaseReference: "97/1626/008395Q",
      court: {
        courtIdentityType: "code",
        courtCode: "2576"
      },
      dateOfConviction: "2011-04-25",
      defendant: {
        defendantType: "individual",
        defendantFirstNames: ["CORTEZ"],
        defendantLastName: "REMANDTEST"
      },
      offences: [
        {
          courtOffenceSequenceNumber: 1,
          cjsOffenceCode: "TH68006",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-04-25",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 4014,
              disposalEffectiveDate: "2011-12-08"
            }
          ],
          offenceId: "5e78e1be-1504-40a3-9dcc-8b94a9264c5a"
        }
      ]
    }
  })
]
