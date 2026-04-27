import type Bichard from "../../utils/world"

export default (ncm: string, { policeApi }: Bichard) => [
  policeApi.mockEnquiryFromNcm(ncm),
  policeApi.mockUpdate("CXU02", {
    expectedRequest: {
      pncCheckName: "QUALIFIERTWO",
      croNumber: "",
      crimeOffenceReferenceNumber: "",
      ownerCode: "01YZ",
      personUrn: "00/448748C",
      courtCaseReference: "97/1626/008395Q",
      court: {
        courtIdentityType: "code",
        courtCode: "2576"
      },
      dateOfConviction: "2011-10-10",
      defendant: {
        defendantType: "individual",
        defendantFirstNames: ["BAIL"],
        defendantLastName: "QUALIFIERTWO"
      },
      offences: [
        {
          courtOffenceSequenceNumber: 1,
          cjsOffenceCode: "RT88004",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-10-10",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 4011,
              disposalEffectiveDate: "2012-01-05",
              disposalQualifiers: ["BA"]
            }
          ],
          offenceId: "395697ee-3d30-4bac-85a1-aee3187138a2"
        }
      ]
    }
  }),
  policeApi.mockUpdate("CXU01", {
    expectedRequest: {
      pncCheckName: "QUALIFIERTWO",
      croNumber: "",
      arrestSummonsNumber: "12/01ZD/01/448748C",
      crimeOffenceReferenceNo: "",
      remandResult: "B",
      remandLocationFfss: "",
      ownerCode: "01YZ",
      personUrn: "00/448748C",
      remandDate: "2011-10-10",
      appearanceResult: "remanded-on-bail",
      bailConditions: [
        "EXCLUSION: NOT TO CONTACT DIRECTLY OR INDIRECTLY  ",
        "SOME ONE SAVE VIA A SOLICITOR TO ARRANGE CONTACT  ",
        "WITH CHILD                                        ",
        "                                                  ",
        "EXCLUSION: NOT TO ENTER SOME ROAD OR SOME LANE IN ",
        "SOME PLACE UNTIL HE HAS ATTENDED IN THE COMPANY OF",
        "A POLICE OFICER TO CONFIRM SOME ONE HAS LEFT THE  ",
        "AREA                                              ",
        "WITH ELECTRONIC TAGGING                           "
      ],
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
