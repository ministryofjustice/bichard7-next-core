import type Bichard from "../../utils/world"

export default (ncm: string, { policeApi }: Bichard) => [
  policeApi.mockEnquiryFromNcm(ncm),
  policeApi.mockUpdate("CXU01", {
    expectedRequest: {
      pncCheckName: "STRIPCONVICT",
      croNumber: "",
      arrestSummonsNumber: "11/01ZD/01/410829M",
      crimeOffenceReferenceNo: "",
      remandResult: "B",
      remandLocationFfss: "",
      ownerCode: "01YZ",
      personUrn: "00/410829M",
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
    //   "<FSC>K01YZ</FSC><IDS>K00/410829M STRIPCONVICT            </IDS><CCR>K97/1626/8395Q                 </CCR><COU>I2576                                                                       STRIPCONVICTION/MISTER                                260920110000</COU><RCC>I01ZD/0300108                                                                       </RCC><CRT>I2576                                                                       08102011</CRT><CCH>K001              TH68006 </CCH><ADJ>INOT GUILTY                         0000 </ADJ><DIS>I2059                      00                                                                            </DIS><CCH>K002              TH68151 </CCH><ADJ>INOT GUILTY                         0000 </ADJ><DIS>I2059                      00                                                                            </DIS><CCH>K003              RT88191 </CCH><ADJ>I                                   0000 </ADJ><ASR>K11/01ZD/01/410829M                    </ASR><ACH>I                                                                                                                                            TH68072                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     NKINGSTON HIGH STREET                                                                                                                                                                                                                   01ZD28112010                </ACH><ADJ>INOT GUILTY   GUILTY        260920110000 </ADJ><DIS>I1015            0000200.0000                                                                            </DIS>"
  })
]
