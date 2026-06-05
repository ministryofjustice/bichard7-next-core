import type Bichard from "../../utils/world"

export default (ncm: string, { policeApi }: Bichard) => [
  policeApi.mockEnquiryFromNcm(ncm),
  policeApi.mockUpdate("CXU02", {
    expectedRequest: {
      pncCheckName: "WORTH",
      croNumber: "",
      crimeOffenceReferenceNumber: "",
      ownerCode: "01YZ",
      longPersonUrn: "2000/377221G",
      courtCaseReference: "97/1626/008395Q",
      court: { courtIdentityType: "code", courtCode: "2375" },
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
          disposalResults: [{ disposalCode: 1016 }],
          offenceId: "24ea3515-16ef-43a1-9e83-1d7a8a4974dd"
        },
        {
          courtOffenceSequenceNumber: 2,
          cjsOffenceCode: "TH68151",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2008-09-26",
          offenceTic: 0,
          disposalResults: [{ disposalCode: 1015, disposalFine: { amount: 100 } }],
          offenceId: "f3949beb-ac3e-437a-acbb-c663fa69b944"
        },
        {
          courtOffenceSequenceNumber: 3,
          cjsOffenceCode: "RT88191",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2008-09-26",
          offenceTic: 0,
          disposalResults: [{ disposalCode: 1015, disposalFine: { amount: 200 } }],
          offenceId: "46b4126d-8172-4114-9d5f-1d43c487d457"
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
              disposalResults: [{ disposalCode: 2004 }],
              locationFsCode: "01VK",
              locationText: { locationText: "KINGSTON HIGH STREET" }
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
              disposalResults: [{ disposalCode: 1015, disposalFine: { amount: 300 } }],
              locationFsCode: "01VK",
              locationText: { locationText: "KINGSTON HIGH STREET" }
            }
          ]
        }
      ]
    }
  })
]
