import type Bichard from "../../utils/world"

export default (ncm: string, { policeApi }: Bichard) => [
  policeApi.mockEnquiryFromNcm(ncm),
  policeApi.mockUpdate("CXU02", {
    matchRegex: "CXU02",
    response: `<?xml version="1.0" standalone="yes"?>
    <CXU02>
      <GMH>073ENQR010175EERRASIPNCA05A73000017300000120231120162473000001                                             050018291</GMH>
      <TXT>I1008 - GWAY - ENQUIRY ERROR MORE THAN 3 DISPOSAL GROUPS 09/0000/00/20004H                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  </TXT>
      <GMT>000003073ENQR010175E</GMT>
    </CXU02>`,
    expectedRequest: "",
    count: 1
  }),
  policeApi.mockUpdate("CXU02", {
    expectedRequest: {
      pncCheckName: "PUFIVE",
      croNumber: "",
      crimeOffenceReferenceNumber: "",
      ownerCode: "01YZ",
      personUrn: "00/410780J",
      courtCaseReference: "97/1626/008395Q",
      court: {
        courtIdentityType: "code",
        courtCode: "2576"
      },
      dateOfConviction: "2011-09-26",
      defendant: {
        defendantType: "individual",
        defendantFirstNames: ["UPDATE"],
        defendantLastName: "PUFIVE"
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
              disposalCode: 1015,
              disposalFine: {
                amount: 100
              }
            }
          ],
          offenceId: "00773f35-53ea-43f4-8a7c-44a9a1d647a8"
        },
        {
          courtOffenceSequenceNumber: 2,
          cjsOffenceCode: "TH68006",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-09-26",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 1015,
              disposalFine: {
                amount: 100
              }
            }
          ],
          offenceId: "1355d607-fa50-4bad-af6e-2721028ee2b4"
        },
        {
          courtOffenceSequenceNumber: 3,
          cjsOffenceCode: "TH68006",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-09-26",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 1015,
              disposalFine: {
                amount: 100
              }
            }
          ],
          offenceId: "c300c19d-01de-485b-bdf3-a8153a0c5d44"
        }
      ]
    },
    count: 1
  })
]
