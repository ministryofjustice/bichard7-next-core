import type Bichard from "../../utils/world"

export default (ncm: string, { policeApi }: Bichard) => [
  policeApi.mockEnquiryFromNcm(ncm),
  policeApi.mockUpdate("CXU01", {
    expectedRequest: {
      pncCheckName: "BAIL",
      croNumber: "",
      arrestSummonsNumber: "11/01ZD/01/410839Y",
      crimeOffenceReferenceNo: "",
      remandResult: "B",
      remandLocationFfss: "",
      ownerCode: "01YZ",
      personUrn: "00/410839Y",
      remandDate: "2011-09-26",
      appearanceResult: "remanded-on-bail",
      bailConditions: [
        "ONE GIVE TO THE COURT ANY PASSPORT HELD AND THE   ",
        "LEFTSHOE                                          ",
        "FROM EACH PAIR OF SHOES OWNED BY YOURSELF ANDYOUR ",
        "IMMEDIATE FAMILY. SHOULD YOU OWN A PAIR OF        ",
        "SLIPPERS THESE WILL BE BURNED                     ",
        "TWO THIS BAIL CONDITION IS OVER TWO HUNDRED       ",
        "CHARACTERS AND SHOULD NOT BE PADDED WITH SPACES AT",
        "THE FIRST OPPORTUNITY BEFORE THE FIFTY CHARACTER  ",
        "POINT AS THAT WOULD JUST LOOSE MORE OF THE BAIL   ",
        "CONDITION MORE OF THE BAIL CONDITION MORE OF THE  ",
        "BAIL CEND                                         "
      ],
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
          courtCode: "1910"
        }
      }
    }
  })
]
