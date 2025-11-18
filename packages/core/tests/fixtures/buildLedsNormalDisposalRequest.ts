import type { AddDisposalRequest } from "../../types/leds/AddDisposalRequest"

export const buildLedsNormalDisposalRequest = (overrides: Partial<AddDisposalRequest> = {}): AddDisposalRequest => {
  const base: AddDisposalRequest = {
    ownerCode: "07A1",
    personUrn: "22/858J",
    checkName: "Pnc check name",
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
        cjsOffenceCode: "00112233",
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
            disposalEffectiveDate: "2024-05-10",
            disposalQualifiers: ["A"],
            disposalText: "Disposal text"
          }
        ],
        offenceId: "112233"
      },
      {
        courtOffenceSequenceNumber: 1,
        cjsOffenceCode: "00112233",
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
            disposalEffectiveDate: "2024-05-10",
            disposalQualifiers: ["A"],
            disposalText: "Disposal text"
          }
        ],
        offenceId: "112233"
      }
    ],
    additionalArrestOffences: [
      {
        asn: "11/01ZD/01/1448754K",
        additionalOffences: [
          {
            courtOffenceSequenceNumber: 2,
            cjsOffenceCode: "00998877",
            committedOnBail: true,
            plea: "Resisted",
            adjudication: "Not Guilty",
            dateOfSentence: "2025-08-15",
            offenceTic: 4,
            offenceStartDate: "2025-08-16",
            offenceStartTime: "14:30+01:00",
            offenceEndDate: "2025-08-17",
            offenceEndTime: "14:45+01:00",
            disposalResults: [
              {
                disposalCode: 10,
                disposalQualifiers: ["A"],
                disposalText: "Disposal text"
              }
            ],
            locationFsCode: "Offence location FS code",
            locationText: "Offence location"
          },
          {
            courtOffenceSequenceNumber: 2,
            cjsOffenceCode: "00998877",
            committedOnBail: true,
            plea: "Resisted",
            adjudication: "Not Guilty",
            dateOfSentence: "2025-08-15",
            offenceTic: 4,
            offenceStartDate: "2025-08-16",
            offenceStartTime: "14:30+01:00",
            offenceEndDate: "2025-08-17",
            offenceEndTime: "14:45+01:00",
            disposalResults: [
              {
                disposalCode: 10,
                disposalQualifiers: ["A"],
                disposalText: "Disposal text"
              }
            ],
            locationFsCode: "Offence location FS code",
            locationText: "Offence location"
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
