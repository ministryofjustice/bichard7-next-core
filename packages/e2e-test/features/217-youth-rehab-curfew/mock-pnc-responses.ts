import type Bichard from "../../utils/world"

export default (ncm: string, { policeApi }: Bichard) => [
  policeApi.mockEnquiryFromNcm(ncm),
  policeApi.mockUpdate("CXU02", {
    expectedRequest: {
      pncCheckName: "REHABORDERS",
      croNumber: "",
      crimeOffenceReferenceNumber: "",
      ownerCode: "01YZ",
      personUrn: "00/440814E",
      courtCaseReference: "97/1626/008395Q",
      court: {
        courtIdentityType: "code",
        courtCode: "2576"
      },
      dateOfConviction: "2011-09-26",
      defendant: {
        defendantType: "individual",
        defendantFirstNames: ["YOUTH"],
        defendantLastName: "REHABORDERS"
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
              disposalCode: 1141,
              disposalEffectiveDate: "2012-07-15"
            },
            {
              disposalCode: 3105,
              disposalDuration: {
                units: "months",
                count: 2
              }
            }
          ],
          offenceId: "baac8287-e400-436a-b5b1-ab574bb883e9"
        },
        {
          courtOffenceSequenceNumber: 2,
          cjsOffenceCode: "TH68010",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-09-26",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 1141,
              disposalEffectiveDate: "2012-07-15"
            },
            {
              disposalCode: 3102,
              disposalDuration: {
                units: "days",
                count: 6
              }
            }
          ],
          offenceId: "d958999d-a817-44fe-b861-b057e32e5479"
        },
        {
          courtOffenceSequenceNumber: 3,
          cjsOffenceCode: "CJ88001",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-09-26",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 1141,
              disposalEffectiveDate: "2012-07-15"
            },
            {
              disposalCode: 3105,
              disposalDuration: {
                units: "months",
                count: 2
              }
            },
            {
              disposalCode: 3106,
              disposalDuration: {
                units: "months",
                count: 3
              },
              disposalText: "EXCLUDED FROM NW4 POSTAL AREA."
            }
          ],
          offenceId: "dd17824d-dfbd-4902-827b-353c58ebb4fc"
        }
      ]
    }
  })
]
