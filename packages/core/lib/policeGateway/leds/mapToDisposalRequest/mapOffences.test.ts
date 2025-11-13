import type { PncUpdateDataset } from "@moj-bichard7/common/types/PncUpdateDataset"

import type { PncUpdateCourtHearingAdjudicationAndDisposal } from "../../../../phase3/types/HearingDetails"

import { PncUpdateType } from "../../../../phase3/types/HearingDetails"
import mapOffences from "./mapOffences"

describe("mapOffences", () => {
  it("maps offences", () => {
    const hearingsAdjudicationsAndDisposals = [
      {
        courtOffenceSequenceNumber: "1",
        offenceReason: "Offence reason",
        type: PncUpdateType.ORDINARY
      },
      {
        hearingDate: "2025-08-14",
        numberOffencesTakenIntoAccount: "3",
        pleaStatus: "NO PLEA TAKEN",
        verdict: "NON-CONVICTION",
        type: PncUpdateType.ADJUDICATION
      },
      {
        disposalQualifiers: "Disposal qualifiers",
        disposalQuantity: "D123100520240012000.9900",
        disposalText: "Disposal text",
        disposalType: "10",
        type: PncUpdateType.DISPOSAL
      },
      {
        disposalQualifiers: "Disposal qualifiers",
        disposalQuantity: "D123100520240012000.9900",
        disposalText: "Disposal text",
        disposalType: "10",
        type: PncUpdateType.DISPOSAL
      },
      {
        courtOffenceSequenceNumber: "1",
        offenceReason: "Offence reason",
        type: PncUpdateType.ORDINARY
      },
      {
        hearingDate: "2025-08-14",
        numberOffencesTakenIntoAccount: "3",
        pleaStatus: "NO PLEA TAKEN",
        verdict: "NON-CONVICTION",
        type: PncUpdateType.ADJUDICATION
      },
      {
        disposalQualifiers: "Disposal qualifiers",
        disposalQuantity: "D123100520240012000.9900",
        disposalText: "Disposal text",
        disposalType: "10",
        type: PncUpdateType.DISPOSAL
      },
      {
        disposalQualifiers: "Disposal qualifiers",
        disposalQuantity: "D123100520240012000.9900",
        disposalText: "Disposal text",
        disposalType: "10",
        type: PncUpdateType.DISPOSAL
      }
    ] as PncUpdateCourtHearingAdjudicationAndDisposal[]

    const pncUpdateDataset = {
      PncQuery: {
        courtCases: [
          {
            courtCaseReference: "1111",
            offences: [{ offence: { sequenceNumber: 1, offenceId: "112233" } }]
          }
        ]
      }
    } as PncUpdateDataset

    const courtCaseReferenceNumber = "1111"

    const expectedOffences = [
      {
        courtOffenceSequenceNumber: 1,
        cjsOffenceCode: "Offence reason",
        plea: "No Plea Taken",
        adjudication: "Non-Conviction",
        dateOfSentence: "2025-08-14",
        offenceTic: 3,
        disposalResults: [
          {
            disposalCode: 10,
            disposalQualifies: ["Disposal qualifiers"],
            disposalText: "Disposal text",
            disposalDuration: {
              count: 123,
              units: "days"
            },
            disposalEffectiveDate: "2024-05-10",
            disposalFine: {
              amount: 12000.99
            }
          },
          {
            disposalCode: 10,
            disposalQualifies: ["Disposal qualifiers"],
            disposalText: "Disposal text",
            disposalDuration: {
              count: 123,
              units: "days"
            },
            disposalEffectiveDate: "2024-05-10",
            disposalFine: {
              amount: 12000.99
            }
          }
        ],
        offenceId: "112233"
      },
      {
        courtOffenceSequenceNumber: 1,
        cjsOffenceCode: "Offence reason",
        plea: "No Plea Taken",
        adjudication: "Non-Conviction",
        dateOfSentence: "2025-08-14",
        offenceTic: 3,
        disposalResults: [
          {
            disposalCode: 10,
            disposalQualifies: ["Disposal qualifiers"],
            disposalText: "Disposal text",
            disposalDuration: {
              count: 123,
              units: "days"
            },
            disposalEffectiveDate: "2024-05-10",
            disposalFine: {
              amount: 12000.99
            }
          },
          {
            disposalCode: 10,
            disposalQualifies: ["Disposal qualifiers"],
            disposalText: "Disposal text",
            disposalDuration: {
              count: 123,
              units: "days"
            },
            disposalEffectiveDate: "2024-05-10",
            disposalFine: {
              amount: 12000.99
            }
          }
        ],
        offenceId: "112233"
      }
    ]

    const offences = mapOffences(hearingsAdjudicationsAndDisposals, pncUpdateDataset, courtCaseReferenceNumber)

    expect(offences).toStrictEqual(expectedOffences)
  })
})
