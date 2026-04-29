import type Bichard from "../../utils/world"

export default (ncm: string, { policeApi }: Bichard) => [
  policeApi.mockEnquiryFromNcm(ncm),
  policeApi.mockUpdate("CXU01", {
    expectedRequest: {
      pncCheckName: "PRERELEASECO",
      croNumber: "",
      arrestSummonsNumber: "12/01ZD/01/448749D",
      crimeOffenceReferenceNo: "",
      remandResult: "C",
      remandLocationFfss: "",
      ownerCode: "01YZ",
      personUrn: "00/448749D",
      remandDate: "2011-10-10",
      appearanceResult: "remanded-in-custody",
      bailConditions: [],
      currentAppearance: {
        court: {
          courtIdentityType: "code",
          courtCode: "2576"
        }
      },
      nextAppearance: {
        date: "2012-01-05",
        court: {
          courtIdentityType: "code",
          courtCode: "2576"
        }
      }
    }
  })
]
