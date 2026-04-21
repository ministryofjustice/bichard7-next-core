import type Bichard from "../../utils/world"

export default (ncm: string, { policeApi }: Bichard) => [
  policeApi.mockEnquiryFromNcm(ncm),
  policeApi.mockUpdate("CXU02", {
    expectedRequest: {
      croNumber: "",
      crimeOffenceReferenceNumber: "",
      courtCaseReference: "97/1626/008395Q",
      court: {
        courtIdentityType: "code",
        courtCode: "2576"
      },
      dateOfConviction: "2011-09-26",
      defendant: {
        defendantType: "individual",
        defendantFirstNames: ["WELSH"],
        defendantLastName: "LANGUAGE"
      },
      offences: [
        {
          courtOffenceSequenceNumber: 1,
          cjsOffenceCode: "TH68006",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-09-26",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 3025,
              disposalDuration: {
                units: "life",
                count: 0
              },
              disposalText: "#,A,A,A,A,E,E,E,E,I,I,I,I,O,O,O,O,U,U,U,U,A,A,A,A,E,E,E,E,I,I,I+"
            }
          ],
          offenceId: "6f1f0839-7e15-436e-b251-0892e3736584"
        },
        {
          courtOffenceSequenceNumber: 2,
          cjsOffenceCode: "TH68151",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-09-26",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 1015,
              disposalFine: {
                amount: 200
              }
            }
          ],
          offenceId: "1ab17ca8-b962-4529-952b-fb57d9815499"
        },
        {
          courtOffenceSequenceNumber: 3,
          cjsOffenceCode: "RT88191",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-09-26",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 1015,
              disposalFine: {
                amount: 300
              }
            }
          ],
          offenceId: "c5c15290-c4f9-4431-ba7b-73dabc893ba5"
        }
      ],
      additionalArrestOffences: [
        {
          asn: "11/01ZD/01/410836V",
          additionalOffences: [
            {
              courtOffenceSequenceNumber: 0,
              offenceCode: {
                offenceCodeType: "cjs",
                cjsOffenceCode: "TH68006"
              },
              committedOnBail: false,
              plea: "Not Guilty",
              adjudication: "Guilty",
              dateOfSentence: "2011-09-26",
              offenceTic: 0,
              offenceStartDate: "2010-11-29",
              disposalResults: [
                {
                  disposalCode: 3025,
                  disposalDuration: {
                    units: "life",
                    count: 0
                  },
                  disposalText: "#,A,A,A,A,E,E,E,E,I,I,I,I,O,O,O,O,U,U,U,U,A,A,A,A,E,E,E,E,I,I,I+"
                }
              ],
              locationFsCode: "01ZD",
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
              dateOfSentence: "2011-09-26",
              offenceTic: 0,
              offenceStartDate: "2010-11-28",
              disposalResults: [
                {
                  disposalCode: 1015,
                  disposalFine: {
                    amount: 500
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
