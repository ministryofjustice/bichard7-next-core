import type { PncUpdateDataset } from "@moj-bichard7/common/types/PncUpdateDataset"

import { PncOperation } from "@moj-bichard7/common/types/PncOperation"

import type PoliceUpdateRequest from "../../../../phase3/types/PoliceUpdateRequest"

import { buildNormalDisposalRequest } from "../../../../tests/fixtures/buildNormalDisposalRequest"
import { buildPncUpdateDataset } from "../../../../tests/fixtures/buildPncUpdateDataset"
import { buildUpdatedRequest } from "../../../../tests/fixtures/buildUpdatedRequest"
import PoliceApiError from "../../PoliceApiError"
import { generateDisposalResultsRequest } from "./generateDisposalResultsRequest"

const personId = "123456"

const request = {
  operation: PncOperation.NORMAL_DISPOSAL,
  request: buildNormalDisposalRequest()
} as PoliceUpdateRequest

describe("normalDisposal", () => {
  it("returns endpoint and requestBody", () => {
    const pncUpdateDataset = buildPncUpdateDataset({ organisationName: "Org" })
    const endpoint = "/people/123456/disposals/ABC123/court-case-disposal-result"
    const requestBody = {
      ownerCode: "07A1",
      personUrn: "22/858J",
      checkName: "Pnc check name",
      courtCaseReference: "98/2048/633Y",
      court: {
        courtIdentityType: "code",
        courtCode: "0001"
      },
      dateOfConviction: "2025-08-12",
      defendant: {
        defendantType: "organisation",
        defendantOrganisationName: "Org"
      },
      carryForward: {
        appearanceDate: "2025-08-13",
        court: {
          courtIdentityType: "code",
          courtCode: "0002"
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
    const expectedResult = { endpoint, requestBody }

    const result = generateDisposalResultsRequest(request, personId, pncUpdateDataset)

    expect(result).toStrictEqual(expectedResult)
  })

  it("returns error when operation is not normal disposal", () => {
    const request = {
      operation: PncOperation.DISPOSAL_UPDATED,
      request: buildUpdatedRequest()
    } as PoliceUpdateRequest
    const pncUpdateDataset = buildPncUpdateDataset()

    const result = generateDisposalResultsRequest(request, personId, pncUpdateDataset)

    expect(result).toBeInstanceOf(PoliceApiError)
    expect((result as PoliceApiError).messages).toContain(
      "mapToRemandRequest called with a non-normal-disposal request"
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

    const result = generateDisposalResultsRequest(request, personId, pncUpdateDataset)

    expect(result).toBeInstanceOf(PoliceApiError)
    expect((result as PoliceApiError).messages).toContain("Failed to update LEDS due to missing data.")
  })

  it("returns error when zod schema does not match any of the fields", () => {
    const requestWithInvalidData = {
      operation: PncOperation.NORMAL_DISPOSAL,
      request: buildNormalDisposalRequest({ psaCourtCode: "000123" })
    } as PoliceUpdateRequest
    const pncUpdateDataset = buildPncUpdateDataset({ organisationName: "Org" })

    const result = generateDisposalResultsRequest(requestWithInvalidData, personId, pncUpdateDataset)

    expect(result).toBeInstanceOf(PoliceApiError)
    expect((result as PoliceApiError).messages).toContain("Failed to validate LEDS request.")
  })
})
