import type Bichard from "../../utils/world"

export default (ncm: string, { policeApi }: Bichard) => [
  policeApi.mockEnquiryFromNcm(ncm),
  policeApi.mockUpdate("CXU01", {
    expectedRequest: {
      pncCheckName: "UNDATED",
      croNumber: "",
      arrestSummonsNumber: "12/01ZD/01/445101N",
      crimeOffenceReferenceNo: "",
      remandResult: "A",
      remandLocationFfss: "",
      ownerCode: "01YZ",
      personUrn: "00/445101N",
      remandDate: "2011-09-26",
      appearanceResult: "adjourned",
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
          courtName: "*****1ST INSTANCE WARRANT ISSUED*****"
        }
      }
    }
  })
]
