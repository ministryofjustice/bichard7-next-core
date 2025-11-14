import type { SubsequentDisposalResultsRequest } from "../../../../types/leds/SubsequentDisposalResultsRequest"

import { PncUpdateType } from "../../../../phase3/types/HearingDetails"
import { buildPncUpdateDataset } from "../../../../tests/fixtures/addDisposalRequests/buildPncUpdateDataset"
import { buildUpdatedRequest } from "../../../../tests/fixtures/addDisposalRequests/buildUpdatedRequest"
import mapToSubsequentDisposalRequest from "./mapToSubsequentDisposalRequest"

describe("mapToSubsequentDisposalRequest", () => {
  it("maps disposal updated (SUBVAR) request to LEDS subsequent disposal request", () => {
    const request = buildUpdatedRequest()
    const pncUpdateDataset = buildPncUpdateDataset()
    const expectedSubsequentDisposalResult = {
      ownerCode: "07A1",
      personUrn: "22/858J",
      checkName: "Pnc check name",
      courtCaseReference: "98/2048/633Y",
      court: {
        courtIdentityType: "code",
        courtCode: "Court code"
      },
      appearanceDate: "2025-08-12",
      reasonForAppearance: "Sentenced Deferred",
      offences: [
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
            }
          ],
          offenceId: "112233"
        }
      ]
    } as SubsequentDisposalResultsRequest

    const subsequentDisposalRequest = mapToSubsequentDisposalRequest(request, pncUpdateDataset)

    expect(subsequentDisposalRequest).toStrictEqual(expectedSubsequentDisposalResult)
  })

  it("maps sentence deferred (SENDEF) request to LEDS subsequent disposal request", () => {
    const request = buildUpdatedRequest({
      hearingDetails: [
        {
          courtOffenceSequenceNumber: "1",
          offenceReason: "Offence reason",
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
    const expectedSubsequentDisposalResult = {
      ownerCode: "07A1",
      personUrn: "22/858J",
      checkName: "Pnc check name",
      courtCaseReference: "98/2048/633Y",
      court: {
        courtIdentityType: "code",
        courtCode: "Court code"
      },
      appearanceDate: "2025-08-12",
      reasonForAppearance: "Sentenced Deferred",
      offences: [
        {
          courtOffenceSequenceNumber: 1,
          cjsOffenceCode: "Offence reason",
          plea: undefined,
          adjudication: undefined,
          dateOfSentence: undefined,
          offenceTic: undefined,
          disposalResults: [
            {
              disposalCode: 10,
              disposalQualifies: ["A"],
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
    } as SubsequentDisposalResultsRequest

    const subsequentDisposalRequest = mapToSubsequentDisposalRequest(request, pncUpdateDataset)

    expect(subsequentDisposalRequest).toStrictEqual(expectedSubsequentDisposalResult)
  })

  it.each(["Sentenced Deferred", "Heard at Court", "Subsequently Varied"])(
    "passes through reasonForAppearance: %s",
    (hearingType) => {
      const request = buildUpdatedRequest({ hearingType })
      const pncUpdateDataset = buildPncUpdateDataset()

      const result = mapToSubsequentDisposalRequest(request, pncUpdateDataset)

      expect(result.reasonForAppearance).toBe(hearingType)
    }
  )
})
