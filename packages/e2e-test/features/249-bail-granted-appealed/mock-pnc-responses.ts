import type Bichard from "../../utils/world"

export default (ncm: string, { policeApi }: Bichard) => [
  policeApi.mockEnquiryFromNcm(ncm),
  policeApi.mockUpdate("CXU01", {
    expectedRequest: {
      pncCheckName: "APPEALEDBAIL",
      croNumber: "",
      arrestSummonsNumber: "12/01ZD/01/445738F",
      crimeOffenceReferenceNo: "",
      remandResult: "C",
      remandLocationFfss: "",
      ownerCode: "01YZ",
      personUrn: "00/445738F",
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
        date: "2011-10-08",
        court: {
          courtIdentityType: "code",
          courtCode: "2576"
        }
      }
    }
  })
]
