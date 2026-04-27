import type Bichard from "../../utils/world"

export default (ncm: string, { policeApi }: Bichard) => [
  policeApi.mockEnquiryFromNcm(ncm),
  policeApi.mockUpdate("CXU02", {
    expectedRequest: {
      pncCheckName: "PTIURN",
      croNumber: "",
      crimeOffenceReferenceNumber: "",
      ownerCode: "01YZ",
      personUrn: "00/376270Y",
      courtCaseReference: "97/1626/008395Q",
      court: {
        courtIdentityType: "code",
        courtCode: "2375"
      },
      dateOfConviction: "2008-09-26",
      defendant: {
        defendantType: "individual",
        defendantFirstNames: ["FORCECALC"],
        defendantLastName: "PTIURN"
      },
      offences: [
        {
          courtOffenceSequenceNumber: 1,
          cjsOffenceCode: "TH68006",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2008-09-26",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 1016
            }
          ],
          offenceId: "c804a2b4-926d-491b-bce0-87265a4cbd43"
        },
        {
          courtOffenceSequenceNumber: 2,
          cjsOffenceCode: "TH68151",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2008-09-26",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 1015,
              disposalFine: {
                amount: 100
              }
            }
          ],
          offenceId: "51590d7d-f395-43cc-9391-5d54acfadd08"
        },
        {
          courtOffenceSequenceNumber: 3,
          cjsOffenceCode: "RT88191",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2008-09-26",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 1015,
              disposalFine: {
                amount: 200
              }
            }
          ],
          offenceId: "62afc032-6ede-42fc-ae17-67ebe06b6eba"
        }
      ],
      additionalArrestOffences: [
        {
          asn: "11/01VK/01/376270Y",
          additionalOffences: [
            {
              courtOffenceSequenceNumber: 0,
              offenceCode: {
                offenceCodeType: "cjs",
                cjsOffenceCode: "TH68006"
              },
              committedOnBail: false,
              plea: "Not Guilty",
              adjudication: "Not Guilty",
              dateOfSentence: "2008-09-26",
              offenceTic: 0,
              offenceStartDate: "2006-11-29",
              disposalResults: [
                {
                  disposalCode: 2004
                }
              ],
              locationFsCode: "01VK",
              locationText: {
                locationText: "KINGSTON HIGH STREET"
              }
            },
            {
              courtOffenceSequenceNumber: 0,
              offenceCode: {
                offenceCodeType: "cjs",
                cjsOffenceCode: "RT88026"
              },
              committedOnBail: false,
              plea: "Not Guilty",
              adjudication: "Guilty",
              dateOfSentence: "2008-09-26",
              offenceTic: 0,
              offenceStartDate: "2006-11-28",
              disposalResults: [
                {
                  disposalCode: 1015,
                  disposalFine: {
                    amount: 300
                  }
                }
              ],
              locationFsCode: "01VK",
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
