import type { PncUpdateCourtHearingAdjudicationAndDisposal } from "../../../../phase3/types/HearingDetails"
import type { Offence } from "../../../../types/leds/AddDisposalRequest"

import { PncUpdateType } from "../../../../phase3/types/HearingDetails"
import { buildNormalDisposalRequest } from "../../../../tests/fixtures/buildNormalDisposalRequest"
import { buildPncUpdateDataset } from "../../../../tests/fixtures/buildPncUpdateDataset"
import mapOffences from "./mapOffences"

describe("mapOffences", () => {
  const pncUpdateDataset = buildPncUpdateDataset()
  const courtCaseReferenceNumber = "98/2048/633Y"

  it("maps offences", () => {
    const normalDisposalRequest = buildNormalDisposalRequest()
    const expectedOffences: Offence[] = [
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
            disposalQualifiers: ["A"],
            disposalText: "Disposal text",
            disposalDuration: {
              count: 123,
              units: "days"
            },
            disposalQualifierDuration: {
              count: 10,
              units: "months"
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
            disposalQualifierDuration: undefined,
            disposalEffectiveDate: "2024-05-10",
            disposalFine: {
              amount: 12000.99
            }
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
            disposalQualifiers: ["A"],
            disposalText: "Disposal text",
            disposalDuration: {
              count: 123,
              units: "days"
            },
            disposalQualifierDuration: {
              count: 0,
              units: "life"
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
            disposalQualifierDuration: undefined,
            disposalEffectiveDate: "2024-05-10",
            disposalFine: {
              amount: 12000.99
            }
          }
        ],
        offenceId: "025459be-b60b-4919-8b7c-67371f2ca80b"
      }
    ]

    const offences = mapOffences(
      normalDisposalRequest.hearingsAdjudicationsAndDisposals,
      pncUpdateDataset,
      courtCaseReferenceNumber,
      false
    )

    expect(offences).toStrictEqual(expectedOffences)
  })

  it("handles when there is no adjudication", () => {
    const hearings = [
      { courtOffenceSequenceNumber: "1", offenceReason: "Reason", type: PncUpdateType.ORDINARY }
    ] as PncUpdateCourtHearingAdjudicationAndDisposal[]

    const offences = mapOffences(hearings, pncUpdateDataset, courtCaseReferenceNumber, false)

    expect(offences[0]).toMatchObject({
      courtOffenceSequenceNumber: 1,
      plea: undefined,
      adjudication: undefined,
      offenceTic: undefined,
      disposalResults: [],
      offenceId: "66cdba73-c8a7-426d-a766-02e449843a69"
    })
  })

  it("handles when there are no disposals", () => {
    const hearings = [
      { courtOffenceSequenceNumber: "1", offenceReason: "Reason", type: PncUpdateType.ORDINARY },
      { hearingDate: "2025-01-01", pleaStatus: "GUILTY", verdict: "CONVICTION", type: PncUpdateType.ADJUDICATION }
    ] as PncUpdateCourtHearingAdjudicationAndDisposal[]

    const offences = mapOffences(hearings, pncUpdateDataset, courtCaseReferenceNumber, false)

    expect(offences[0].disposalResults).toEqual([])
  })

  it("handles missing disposalQualifiers and disposalText", () => {
    const hearings = [
      { courtOffenceSequenceNumber: "1", offenceReason: "Reason", type: PncUpdateType.ORDINARY },
      { type: PncUpdateType.DISPOSAL, disposalQuantity: "D001010120240000000.0000" }
    ] as PncUpdateCourtHearingAdjudicationAndDisposal[]

    const offences = mapOffences(hearings, pncUpdateDataset, courtCaseReferenceNumber, false)

    expect(offences[0].disposalResults?.[0].disposalQualifiers).toBeUndefined()
    expect(offences[0].disposalResults?.[0].disposalText).toBeUndefined()
  })

  it("doesn't include disposalDuration if units is empty string", () => {
    const normalDisposalRequest = buildNormalDisposalRequest({
      hearingsAdjudicationsAndDisposals: [
        {
          courtOffenceSequenceNumber: "2",
          offenceReason: "CJ03507",
          type: PncUpdateType.ORDINARY
        },
        {
          hearingDate: "14082025",
          numberOffencesTakenIntoAccount: "3",
          pleaStatus: "NO PLEA TAKEN",
          verdict: "NON-CONVICTION",
          type: PncUpdateType.ADJUDICATION
        },
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
      courtCaseReferenceNumber,
      false
    )

    expect(offences[0].disposalResults?.[0].disposalDuration).toBeUndefined()
  })

  it.each([2059, 2060])(
    "should not include plea and adjudication when case is carried forward or referred to court case and offence has disposal result %i",
    (disposalResultCode) => {
      const normalDisposalRequest = buildNormalDisposalRequest({
        hearingsAdjudicationsAndDisposals: [
          {
            courtOffenceSequenceNumber: "2",
            offenceReason: "CJ03507",
            type: PncUpdateType.ORDINARY
          },
          {
            hearingDate: "14082025",
            numberOffencesTakenIntoAccount: "3",
            pleaStatus: "NO PLEA TAKEN",
            verdict: "NON-CONVICTION",
            type: PncUpdateType.ADJUDICATION
          },
          {
            disposalQualifiers: "A",
            disposalQuantity: "    10052024          00",
            disposalText: "Disposal text",
            disposalType: "1015",
            type: PncUpdateType.DISPOSAL
          },
          {
            courtOffenceSequenceNumber: "3",
            offenceReason: "SX03001",
            type: PncUpdateType.ORDINARY
          },
          {
            hearingDate: "14082025",
            numberOffencesTakenIntoAccount: "3",
            pleaStatus: "NO PLEA TAKEN",
            verdict: "NON-CONVICTION",
            type: PncUpdateType.ADJUDICATION
          },
          {
            disposalQualifiers: "A",
            disposalQuantity: "    10052024          00",
            disposalText: "Disposal text",
            disposalType: String(disposalResultCode),
            type: PncUpdateType.DISPOSAL
          }
        ]
      })

      const offences = mapOffences(
        normalDisposalRequest.hearingsAdjudicationsAndDisposals,
        pncUpdateDataset,
        courtCaseReferenceNumber,
        true
      )

      expect(offences[0].cjsOffenceCode).toBe("CJ03507")
      expect(offences[0].plea).toBe("No Plea Taken")
      expect(offences[0].adjudication).toBe("Non-Conviction")

      expect(offences[1].cjsOffenceCode).toBe("SX03001")
      expect(offences[1].plea).toBeUndefined()
      expect(offences[1].adjudication).toBeUndefined()
    }
  )
})
