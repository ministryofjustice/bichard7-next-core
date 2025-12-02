import type { PncUpdateCourtHearingAdjudicationAndDisposal } from "../../../../phase3/types/HearingDetails"

import { PncUpdateType } from "../../../../phase3/types/HearingDetails"
import { buildNormalDisposalRequest } from "../../../../tests/fixtures/buildNormalDisposalRequest"
import { buildPncUpdateDataset } from "../../../../tests/fixtures/buildPncUpdateDataset"
import mapOffences from "./mapOffences"

describe("mapOffences", () => {
  const pncUpdateDataset = buildPncUpdateDataset()
  const courtCaseReferenceNumber = "98/2048/633Y"

  it("maps offences", () => {
    const normalDisposalRequest = buildNormalDisposalRequest()
    const expectedOffences = [
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
            disposalQualifiers: ["A"],
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
            disposalQualifiers: ["A"],
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
        cjsOffenceCode: "00112233",
        plea: "No Plea Taken",
        adjudication: "Non-Conviction",
        dateOfSentence: "2025-08-14",
        offenceTic: 3,
        disposalResults: [
          {
            disposalCode: 10,
            disposalQualifiers: ["A"],
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
            disposalQualifiers: ["A"],
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

    const offences = mapOffences(
      normalDisposalRequest.hearingsAdjudicationsAndDisposals,
      pncUpdateDataset,
      courtCaseReferenceNumber
    )

    expect(offences).toStrictEqual(expectedOffences)
  })

  it("handles when there is no adjudication", () => {
    const hearings = [
      { courtOffenceSequenceNumber: "1", offenceReason: "Reason", type: PncUpdateType.ORDINARY }
    ] as PncUpdateCourtHearingAdjudicationAndDisposal[]

    const offences = mapOffences(hearings, pncUpdateDataset, courtCaseReferenceNumber)

    expect(offences[0]).toMatchObject({
      courtOffenceSequenceNumber: 1,
      plea: undefined,
      adjudication: undefined,
      offenceTic: undefined,
      disposalResults: [],
      offenceId: "112233"
    })
  })

  it("handles when there are no disposals", () => {
    const hearings = [
      { courtOffenceSequenceNumber: "1", offenceReason: "Reason", type: PncUpdateType.ORDINARY },
      { hearingDate: "2025-01-01", pleaStatus: "GUILTY", verdict: "CONVICTION", type: PncUpdateType.ADJUDICATION }
    ] as PncUpdateCourtHearingAdjudicationAndDisposal[]

    const offences = mapOffences(hearings, pncUpdateDataset, courtCaseReferenceNumber)

    expect(offences[0].disposalResults).toEqual([])
  })

  it("handles missing disposalQualifiers and disposalText", () => {
    const hearings = [
      { courtOffenceSequenceNumber: "1", offenceReason: "Reason", type: PncUpdateType.ORDINARY },
      { type: PncUpdateType.DISPOSAL, disposalQuantity: "D001010120240000000.0000" }
    ] as PncUpdateCourtHearingAdjudicationAndDisposal[]

    const offences = mapOffences(hearings, pncUpdateDataset, courtCaseReferenceNumber)

    expect(offences[0].disposalResults?.[0].disposalQualifiers).toEqual([])
    expect(offences[0].disposalResults?.[0].disposalText).toBeUndefined()
  })

  it("doesn't include disposalDuration if units is empty string", () => {
    const normalDisposalRequest = buildNormalDisposalRequest({
      hearingsAdjudicationsAndDisposals: [
        {
          disposalQualifiers: "A",
          disposalQuantity: "    10052024          00",
          disposalText: "Disposal text",
          disposalType: "10",
          type: PncUpdateType.DISPOSAL
        }
      ]
    })

    const offences = mapOffences(
      normalDisposalRequest.hearingsAdjudicationsAndDisposals,
      pncUpdateDataset,
      courtCaseReferenceNumber
    )

    expect(offences[0].disposalResults?.[0].disposalDuration).toBeUndefined()
  })
})
