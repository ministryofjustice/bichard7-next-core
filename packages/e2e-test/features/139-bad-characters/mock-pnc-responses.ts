import type Bichard from "../../utils/world"

export default (ncm: string, { policeApi }: Bichard) => [
  policeApi.mockEnquiryFromNcm(ncm),
  policeApi.mockUpdate("CXU01", {
    expectedRequest: {
      pncCheckName: "TWOHUNDRED",
      croNumber: "",
      arrestSummonsNumber: "11/01ZD/01/410862Y",
      crimeOffenceReferenceNo: "",
      remandResult: "B",
      remandLocationFfss: "",
      ownerCode: "01YZ",
      personUrn: "00/410862Y",
      remandDate: "2011-09-26",
      appearanceResult: "remanded-on-bail",
      bailConditions: [
        "BAIL CONDITIONS TEXT EQUAL TO TWO HUNDRED         ",
        "CHARACTERS UP TO END. THIS TEXT ALSO CONTAINS AN  ",
        "INVALID CHARACTER WHICH SHOULD BE CONVERTED INTO A",
        "QUESTION MARK. HERE IS THE INVALID CHARACTER NOW ?",
        "THE END                                           "
      ],
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
          courtCode: "1910"
        }
      }
    }
  })
]
