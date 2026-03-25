import type { AddDisposalRequest } from "../../types/leds/AddDisposalRequest"

export const buildLedsNormalDisposalRequest = (overrides: Partial<AddDisposalRequest> = {}): AddDisposalRequest => {
  const base: AddDisposalRequest = {
    ownerCode: "07A1",
    personUrn: "1950/123X",
    courtCaseReference: "98/2048/633Y",
    court: {
      courtIdentityType: "name",
      courtName: "Court house name"
    },
    dateOfConviction: "2025-08-12",
    defendant: {
      defendantType: "individual",
      defendantFirstNames: ["Adam"],
      defendantLastName: "Brown"
    },
    carryForward: {
      appearanceDate: "2025-08-13",
      court: {
        courtIdentityType: "code",
        courtCode: "0001"
      }
    },
    referToCourtCase: {
      reference: "121212"
    },
    offences: [
      {
        courtOffenceSequenceNumber: 1,
        cjsOffenceCode: "SX03001",
        roleQualifiers: ["AT"],
        plea: "No Plea Taken",
        adjudication: "Non-Conviction",
        dateOfSentence: "2025-08-14",
        offenceTic: 3,
        disposalResults: [
          {
            disposalCode: 10,
            disposalDuration: {
              units: "days",
              count: 123
            },
            disposalFine: {
              amount: 12000.99
            },
            disposalQualifierDuration: { count: 10, units: "months" },
            disposalEffectiveDate: "2024-05-10",
            disposalQualifiers: ["A"],
            disposalText: "Disposal text"
          },
          {
            disposalCode: 10,
            disposalDuration: {
              units: "days",
              count: 123
            },
            disposalFine: {
              amount: 12000.99
            },
            disposalQualifierDuration: undefined,
            disposalEffectiveDate: "2024-05-10",
            disposalQualifiers: ["A"],
            disposalText: "Disposal text"
          }
        ],
        offenceId: "66cdba73-c8a7-426d-a766-02e449843a69"
      },
      {
        courtOffenceSequenceNumber: 2,
        cjsOffenceCode: "CJ03507",
        roleQualifiers: undefined,
        plea: "No Plea Taken",
        adjudication: "Non-Conviction",
        dateOfSentence: "2025-08-14",
        offenceTic: 3,
        disposalResults: [
          {
            disposalCode: 10,
            disposalDuration: {
              units: "days",
              count: 123
            },
            disposalFine: {
              amount: 12000.99
            },
            disposalQualifierDuration: { count: 0, units: "life" },
            disposalEffectiveDate: "2024-05-10",
            disposalQualifiers: ["A"],
            disposalText: "Disposal text"
          },
          {
            disposalCode: 10,
            disposalDuration: {
              units: "days",
              count: 123
            },
            disposalFine: {
              amount: 12000.99
            },
            disposalQualifierDuration: undefined,
            disposalEffectiveDate: "2024-05-10",
            disposalQualifiers: ["A"],
            disposalText: "Disposal text"
          }
        ],
        offenceId: "025459be-b60b-4919-8b7c-67371f2ca80b"
      }
    ],
    additionalArrestOffences: [
      {
        asn: "11/01ZD/01/00001448754K",
        additionalOffences: [
          {
            courtOffenceSequenceNumber: 3,
            offenceCode: {
              offenceCodeType: "cjs",
              cjsOffenceCode: "SX03001"
            },
            roleQualifiers: ["AA"],
            committedOnBail: true,
            plea: "Resisted",
            adjudication: "Not Guilty",
            dateOfSentence: "2025-08-15",
            offenceTic: 4,
            offenceStartDate: "2025-08-16",
            offenceStartTime: "14:30+00:00",
            offenceEndDate: "2025-08-17",
            offenceEndTime: "14:45+00:00",
            disposalResults: [
              {
                disposalCode: 10,
                disposalDuration: {
                  count: 123,
                  units: "days"
                },
                disposalEffectiveDate: "2024-05-10",
                disposalFine: {
                  amount: 12000.99
                },
                disposalQualifierDuration: undefined,
                disposalQualifiers: ["A"],
                disposalText: "Disposal text"
              }
            ],
            locationFsCode: "Offence location FS code",
            locationText: { locationText: "Offence location" }
          },
          {
            courtOffenceSequenceNumber: 4,
            offenceCode: {
              offenceCodeType: "cjs",
              cjsOffenceCode: "TH68006"
            },
            roleQualifiers: undefined,
            committedOnBail: true,
            plea: "Resisted",
            adjudication: "Not Guilty",
            dateOfSentence: "2025-08-15",
            offenceTic: 4,
            offenceStartDate: "2025-08-16",
            offenceStartTime: "14:30+00:00",
            offenceEndDate: "2025-08-17",
            offenceEndTime: "14:45+00:00",
            disposalResults: [
              {
                disposalCode: 10,
                disposalDuration: {
                  count: 123,
                  units: "days"
                },
                disposalEffectiveDate: "2024-05-10",
                disposalFine: {
                  amount: 12000.99
                },
                disposalQualifierDuration: undefined,
                disposalQualifiers: ["A"],
                disposalText: "Disposal text"
              }
            ],
            locationFsCode: "Offence location FS code",
            locationText: { locationText: "Offence location" }
          }
        ]
      }
    ]
  }

  return {
    ...base,
    ...overrides
  }
}
