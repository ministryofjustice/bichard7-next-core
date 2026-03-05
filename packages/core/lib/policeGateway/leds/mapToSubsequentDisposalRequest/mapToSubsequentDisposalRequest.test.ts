import type { SubsequentDisposalResultsRequest } from "../../../../types/leds/SubsequentDisposalResultsRequest"

import { PncUpdateType } from "../../../../phase3/types/HearingDetails"
import { buildPncUpdateDataset } from "../../../../tests/fixtures/buildPncUpdateDataset"
import { buildUpdatedRequest } from "../../../../tests/fixtures/buildUpdatedRequest"
import mapToSubsequentDisposalRequest from "./mapToSubsequentDisposalRequest"

describe("mapToSubsequentDisposalRequest", () => {
  it("maps disposal updated (SUBVAR) request to LEDS subsequent disposal request", () => {
    const request = buildUpdatedRequest()
    const pncUpdateDataset = buildPncUpdateDataset()
    const expectedSubsequentDisposalResult: SubsequentDisposalResultsRequest = {
      ownerCode: "07A1",
      personUrn: "1950/123X",
      courtCaseReference: "98/2048/633Y",
      court: {
        courtIdentityType: "code",
        courtCode: "0001"
      },
      appearanceDate: "2025-08-12",
      reasonForAppearance: "Sentence Deferred",
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
              disposalQualifiers: ["B"],
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
          offenceId: "66cdba73-c8a7-426d-a766-02e449843a69"
        }
      ]
    }

    const subsequentDisposalRequest = mapToSubsequentDisposalRequest(request, pncUpdateDataset)

    expect(subsequentDisposalRequest).toStrictEqual(expectedSubsequentDisposalResult)
  })

  it("maps sentence deferred (SENDEF) request to LEDS subsequent disposal request", () => {
    const request = buildUpdatedRequest({
      hearingDetails: [
        {
          courtOffenceSequenceNumber: "1",
          offenceReason: "RT88191",
          type: PncUpdateType.ORDINARY
        },
        {
          disposalQualifiers: "A",
          disposalQuantity: "D123100520240012000.9900",
          disposalText: "Disposal text",
          disposalType: "10",
          type: PncUpdateType.DISPOSAL
        }
      ]
    })
    const pncUpdateDataset = buildPncUpdateDataset()
    const expectedSubsequentDisposalResult: SubsequentDisposalResultsRequest = {
      ownerCode: "07A1",
      personUrn: "1950/123X",
      courtCaseReference: "98/2048/633Y",
      court: {
        courtIdentityType: "code",
        courtCode: "0001"
      },
      appearanceDate: "2025-08-12",
      reasonForAppearance: "Sentence Deferred",
      offences: [
        {
          courtOffenceSequenceNumber: 1,
          cjsOffenceCode: "RT88191",
          roleQualifiers: undefined,
          plea: undefined,
          adjudication: undefined,
          dateOfSentence: undefined,
          offenceTic: undefined,
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
            }
          ],
          offenceId: "66cdba73-c8a7-426d-a766-02e449843a69"
        }
      ]
    }

    const subsequentDisposalRequest = mapToSubsequentDisposalRequest(request, pncUpdateDataset)

    expect(subsequentDisposalRequest).toStrictEqual(expectedSubsequentDisposalResult)
  })

  it.each([
    { hearingType: "D", reasonForAppearance: "Sentence Deferred" },
    { hearingType: "V", reasonForAppearance: "Subsequently Varied" }
  ])("passes through reasonForAppearance: %s", ({ hearingType, reasonForAppearance }) => {
    const request = buildUpdatedRequest({ hearingType })
    const pncUpdateDataset = buildPncUpdateDataset()

    const result = mapToSubsequentDisposalRequest(request, pncUpdateDataset)

    expect(result.reasonForAppearance).toBe(reasonForAppearance)
  })
})
