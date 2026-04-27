import type Bichard from "../../utils/world"

export default (ncm: string, { policeApi }: Bichard) => [
  policeApi.mockEnquiryFromNcm(ncm),
  policeApi.mockUpdate("CXU01", {
    expectedRequest: {
      pncCheckName: "NEWTRPRTWO",
      croNumber: "",
      arrestSummonsNumber: "11/01ZD/01/410795A",
      crimeOffenceReferenceNo: "",
      remandResult: "B",
      remandLocationFfss: "",
      ownerCode: "01YZ",
      personUrn: "00/410795A",
      remandDate: "2011-09-26",
      appearanceResult: "remanded-on-bail",
      bailConditions: [],
      currentAppearance: {
        court: {
          courtIdentityType: "name",
          courtName: "***** FTA DATED WARRANT *****"
        }
      },
      nextAppearance: {
        date: "2011-10-01",
        court: {
          courtIdentityType: "code",
          courtCode: "2576"
        }
      }
    }
  })
]
