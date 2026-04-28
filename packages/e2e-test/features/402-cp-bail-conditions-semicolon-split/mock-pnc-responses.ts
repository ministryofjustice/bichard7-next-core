import type Bichard from "../../utils/world"

export default (ncm: string, { policeApi }: Bichard) => [
  policeApi.mockEnquiryFromNcm(ncm),
  policeApi.mockUpdate("CXU01", {
    expectedRequest: {
      pncCheckName: "SMITHY",
      croNumber: "",
      arrestSummonsNumber: "22/01ZD/01/410803X",
      crimeOffenceReferenceNo: "",
      remandResult: "B",
      remandLocationFfss: "",
      ownerCode: "01YZ",
      personUrn: "00/410803X",
      remandDate: "2022-04-11",
      appearanceResult: "remanded-on-bail",
      bailConditions: [
        "CURFEW                                            ",
        "BETWEEN : 11:00                                   ",
        "AND : 22:00                                       ",
        "FREQUENCY : 2                                     ",
        "EXCLUSION - NOT GO TO ANY PUBLIC HOUSE, LICENSED  ",
        "CLUB OR                                           ",
        "OFF LICENCE                                       ",
        "                                                  ",
        "EXCLUSION - NOT TO SIT IN THE FRONT SEAT OF ANY   ",
        "MOTOR                                             ",
        "VEHICLE                                           ",
        "                                                  ",
        "OTHER - SEE SOLICITOR / BARRISTER                 ",
        "                                                  ",
        "                                                  ",
        "                                                  ",
        "RESIDENCE - LIVE, AND SLEEP                       ",
        "EACH NIGHT, AT BAIL HOSTEL                        ",
        "HOSTEL NAME : NEWHOSTEL                           "
      ],
      currentAppearance: {
        court: {
          courtIdentityType: "code",
          courtCode: "2576"
        }
      },
      nextAppearance: {
        date: "2022-04-16",
        court: {
          courtIdentityType: "code",
          courtCode: "2577"
        }
      }
    }
  })
]
