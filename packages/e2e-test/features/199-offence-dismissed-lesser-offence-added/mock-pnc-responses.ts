import type Bichard from "../../utils/world"

export default (ncm: string, { policeApi }: Bichard) => [
  policeApi.mockEnquiryFromNcm(ncm),
  policeApi.mockUpdate("CXU02", {
    expectedRequest: {
      pncCheckName: "PICADILLUS",
      croNumber: "",
      crimeOffenceReferenceNumber: "",
      ownerCode: "01YZ",
      personUrn: "00/415366U",
      courtCaseReference: "97/1626/008395Q",
      court: {
        courtIdentityType: "code",
        courtCode: "2576"
      },
      dateOfConviction: "2011-09-26",
      defendant: {
        defendantType: "individual",
        defendantFirstNames: ["THETUBE"],
        defendantLastName: "PICADILLUS"
      },
      offences: [
        {
          courtOffenceSequenceNumber: 1,
          cjsOffenceCode: "TH68006",
          plea: "Not Guilty",
          adjudication: "Not Guilty",
          dateOfSentence: "2011-09-26",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 2050
            }
          ],
          offenceId: "06a19693-5ef6-4f43-91bb-69af53d4f5fe"
        }
      ],
      additionalArrestOffences: [
        {
          asn: "11/01ZD/01/415366U",
          additionalOffences: [
            {
              courtOffenceSequenceNumber: 0,
              offenceCode: {
                offenceCodeType: "cjs",
                cjsOffenceCode: "TH68072"
              },
              committedOnBail: false,
              plea: "Guilty",
              adjudication: "Guilty",
              dateOfSentence: "2011-09-26",
              offenceTic: 0,
              offenceStartDate: "2010-11-28",
              disposalResults: [
                {
                  disposalCode: 1018,
                  disposalDuration: {
                    units: "months",
                    count: 12
                  }
                }
              ],
              locationFsCode: "01ZD",
              locationText: {
                locationText: "KINGSTON HIGH STREET"
              }
            }
          ]
        }
      ]
    }
  })
]
