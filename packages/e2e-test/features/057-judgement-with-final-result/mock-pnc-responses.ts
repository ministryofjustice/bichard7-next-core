import type Bichard from "../../utils/world"

export default (ncm: string, { policeApi }: Bichard) => [
  policeApi.mockEnquiryFromNcm(ncm),
  policeApi.mockUpdate("CXU02", {
    expectedRequest: {
      pncCheckName: "ANCHOVY",
      croNumber: "",
      crimeOffenceReferenceNumber: "",
      ownerCode: "01YZ",
      personUrn: "00/410805L",
      courtCaseReference: "97/1626/008395Q",
      court: {
        courtIdentityType: "code",
        courtCode: "2576"
      },
      dateOfConviction: "2011-09-26",
      defendant: {
        defendantType: "individual",
        defendantFirstNames: ["ADAM"],
        defendantLastName: "ANCHOVY"
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
              disposalCode: 1002,
              disposalDuration: {
                units: "months",
                count: 12
              },
              disposalQualifiers: ["F"]
            },
            {
              disposalCode: 1024,
              disposalDuration: {
                units: "months",
                count: 12
              },
              disposalQualifiers: ["F"]
            },
            {
              disposalCode: 1081,
              disposalDuration: {
                units: "months",
                count: 12
              },
              disposalQualifiers: ["F"]
            }
          ],
          offenceId: "e99e9752-7293-4f09-956c-257d77534a63"
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
              disposalCode: 1100,
              disposalDuration: {
                units: "months",
                count: 6
              },
              disposalText: "EXCLUDED FROM ALL LICENSED PREMISES WITHIN DIDLY DISTRICT COUNC+"
            },
            {
              disposalCode: 3025,
              disposalDuration: {
                units: "life",
                count: 0
              },
              disposalText: "SEA MONKEY"
            }
          ],
          offenceId: "3e9b55f0-561b-4154-9ac5-c7f438dc6c2e"
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
              disposalCode: 3041,
              disposalDuration: {
                units: "months",
                count: 12
              },
              disposalText: "EXCLUDED FROM SEAWORLD PUBLIC HOUSE, SEAWORLD, PICKERING, NORTH+"
            }
          ],
          offenceId: "8999c61b-092a-4c6b-82ed-a4f13beb96c8"
        },
        {
          courtOffenceSequenceNumber: 4,
          cjsOffenceCode: "TH68006",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-09-26",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 1116,
              disposalEffectiveDate: "2013-05-21"
            }
          ],
          offenceId: "876f82ef-8ccb-4f55-9354-100c9aa607f5"
        },
        {
          courtOffenceSequenceNumber: 5,
          cjsOffenceCode: "TH68006",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-09-26",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 1116,
              disposalEffectiveDate: "2011-09-26"
            }
          ],
          offenceId: "c832dd12-9663-4c60-be21-edaa507a4e59"
        },
        {
          courtOffenceSequenceNumber: 6,
          cjsOffenceCode: "TH68006",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-09-26",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 1116,
              disposalEffectiveDate: "2011-09-26"
            }
          ],
          offenceId: "78afdbe5-7bb6-4d24-8dd9-28ab425aff34"
        },
        {
          courtOffenceSequenceNumber: 7,
          cjsOffenceCode: "TH68006",
          plea: "Not Guilty",
          adjudication: "Guilty",
          dateOfSentence: "2011-09-26",
          offenceTic: 0,
          disposalResults: [
            {
              disposalCode: 1116
            }
          ],
          offenceId: "858a5cae-2539-4aff-bbfe-acce737ba907"
        }
      ]
    }
  })
]
