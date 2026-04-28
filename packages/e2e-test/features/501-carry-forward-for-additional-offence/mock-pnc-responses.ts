import type Bichard from "../../utils/world"

export default (ncm: string, { policeApi }: Bichard) => [
  policeApi.mockEnquiryFromNcm(ncm),
  policeApi.mockUpdate("CXU01", {
    expectedRequest: {
      pncCheckName: "TWOZEROSIXZE",
      croNumber: "",
      arrestSummonsNumber: "11/01ZD/01/500016E",
      crimeOffenceReferenceNo: "",
      remandResult: "B",
      remandLocationFfss: "",
      ownerCode: "01YZ",
      personUrn: "00/500016E",
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
        date: "2011-10-08",
        court: {
          courtIdentityType: "code",
          courtCode: "2576"
        }
      }
    }
  }),
  policeApi.mockUpdate("CXU02", {
    // TODO: Fix the expected update request
    // expectedRequest:
    //   "<FSC>K01YZ</FSC><IDS>K00/500016E TWOZEROSIXZE            </IDS><CCR>K97/1626/8395Q                 </CCR><COU>I2576                                                                       TWOZEROSIXZERO/PNCUPDATE                              260920110000</COU><CRT>I2576                                                                       08102011</CRT><CCH>K001              TH68006 </CCH><ADJ>INOT GUILTY   NON-CONVICTION260920110000 </ADJ><DIS>I2063                      00                                                                            </DIS><ASR>K11/01ZD/01/500016E                    </ASR><ACH>I                                                                                                                                            TH68151                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     NKINGSTON HIGH STREET                                                                                                                                                                                                                   01ZD28112010                </ACH><ADJ>INOT GUILTY                         0000 </ADJ><DIS>I2059                      00                                                                            </DIS>"
  })
]
