import type Bichard from "../../utils/world"

export default (ncm: string, { policeApi }: Bichard) => [
  policeApi.mockEnquiryFromNcm(ncm),
  policeApi.mockUpdate("CXU01", {
    expectedRequest: {
      pncCheckName: "FTAUNDATED",
      croNumber: "",
      arrestSummonsNumber: "13/01ZD/01/449633N",
      crimeOffenceReferenceNo: "",
      remandResult: "B",
      remandLocationFfss: "",
      ownerCode: "01YZ",
      personUrn: "00/449633N",
      remandDate: "2011-09-25",
      appearanceResult: "remanded-on-bail",
      bailConditions: [],
      currentAppearance: {
        court: {
          courtIdentityType: "code",
          courtCode: "2576"
        }
      },
      nextAppearance: {
        court: {
          courtIdentityType: "name",
          courtName: "*****FAILED TO APPEAR*****"
        }
      }
    }
  })
]
