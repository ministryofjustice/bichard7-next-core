import type Bichard from "../../utils/world"

export default (ncm: string, { policeApi }: Bichard) => [
  policeApi.mockEnquiryFromNcm(ncm),
  policeApi.mockUpdate("CXU02", {
    expectedRequest: {
      pncCheckName: "WORTH",
      croNumber: "",
      crimeOffenceReferenceNumber: "",
      ownerCode: "93YZ",
      personUrn: "00/377221G",
      courtCaseReference: "97/1626/008395Q",
      court: {
        courtIdentityType: "code",
        courtCode: "2375"
      },
      dateOfConviction: "2008-09-26",
      defendant: {
        defendantType: "individual",
        defendantFirstNames: ["DAVID"],
        defendantLastName: "WORTH"
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
          offenceId: "20545d45-3ac1-4c0d-b159-c9a5a75adffa"
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
          offenceId: "2c7c94c1-f1c7-42f0-8d9d-e04aa79c93ee"
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
          offenceId: "89c64d6f-a965-4b90-9714-743f02d19aba"
        }
      ],
      additionalArrestOffences: [
        {
          asn: "11/01VK/01/377221G",
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
              locationFsCode: "9300",
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
              locationFsCode: "9300",
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
