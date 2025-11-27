import type { PncUpdateDataset } from "@moj-bichard7/common/types/PncUpdateDataset"

import { PncOperation } from "@moj-bichard7/common/types/PncOperation"

import type PoliceUpdateRequest from "../../../../phase3/types/PoliceUpdateRequest"
import type { SubsequentDisposalResultsRequest } from "../../../../types/leds/SubsequentDisposalResultsRequest"

import { buildPncUpdateDataset } from "../../../../tests/fixtures/buildPncUpdateDataset"
import { buildRemandRequest } from "../../../../tests/fixtures/buildRemandRequest"
import { buildUpdatedRequest } from "../../../../tests/fixtures/buildUpdatedRequest"
import PoliceApiError from "../../PoliceApiError"
import { generateSubsequentDisposalRequest } from "./generateSubsequentDisposalRequest"

const personId = "123"
const request = {
  operation: PncOperation.DISPOSAL_UPDATED,
  request: buildUpdatedRequest()
} as PoliceUpdateRequest
const pncUpdateDataset = buildPncUpdateDataset()

describe("subsequentDisposal", () => {
  it("returns endpoint and requestBody", () => {
    const endpoint = "/people/123/disposals/ABC123/court-case-subsequent-disposal-results"
    const requestBody = {
      ownerCode: "07A1",
      personUrn: "22/858J",
      checkName: "Pnc check name",
      courtCaseReference: "98/2048/633Y",
      court: {
        courtIdentityType: "code",
        courtCode: "0001"
      },
      appearanceDate: "2025-08-12",
      reasonForAppearance: "Sentenced Deferred",
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
          offenceId: "112233"
        }
      ]
    } as SubsequentDisposalResultsRequest
    const expectedResult = { endpoint, requestBody }

    const result = generateSubsequentDisposalRequest(request, personId, pncUpdateDataset)

    expect(result).toStrictEqual(expectedResult)
  })

  it("returns error when operation is not subsequent-disposal", () => {
    const remandRequest = {
      operation: PncOperation.REMAND,
      request: buildRemandRequest()
    } as PoliceUpdateRequest

    const result = generateSubsequentDisposalRequest(remandRequest, personId, pncUpdateDataset)

    expect(result).toBeInstanceOf(PoliceApiError)
    expect((result as PoliceApiError).messages).toContain(
      "mapToRemandRequest called with a non-disposal-updated request"
    )
  })

  it("returns error when courtCaseId is not found", () => {
    const pncUpdateDataset = {
      PncQuery: {
        courtCases: [
          {
            courtCaseReference: "98/2048/633Z"
          }
        ]
      }
    } as PncUpdateDataset

    const result = generateSubsequentDisposalRequest(request, personId, pncUpdateDataset)

    expect(result).toBeInstanceOf(PoliceApiError)
    expect((result as PoliceApiError).messages).toContain("Failed to update LEDS due to missing data.")
  })

  it("returns error when zod schema does not match any of the fields", () => {
    const requestWithInvalidData = {
      operation: PncOperation.DISPOSAL_UPDATED,
      request: buildUpdatedRequest({ courtCode: "longInvalidCourtCode" })
    } as PoliceUpdateRequest

    const result = generateSubsequentDisposalRequest(requestWithInvalidData, personId, pncUpdateDataset)

    expect(result).toBeInstanceOf(PoliceApiError)
    expect((result as PoliceApiError).messages).toContain("Failed to validate LEDS request.")
  })
})
