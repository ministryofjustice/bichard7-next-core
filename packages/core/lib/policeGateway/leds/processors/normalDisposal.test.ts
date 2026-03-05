import type { PncUpdateDataset } from "@moj-bichard7/common/types/PncUpdateDataset"

import { PncOperation } from "@moj-bichard7/common/types/PncOperation"

import type PoliceUpdateRequest from "../../../../phase3/types/PoliceUpdateRequest"

import { buildNormalDisposalRequest } from "../../../../tests/fixtures/buildNormalDisposalRequest"
import { buildPncUpdateDataset } from "../../../../tests/fixtures/buildPncUpdateDataset"
import { buildUpdatedRequest } from "../../../../tests/fixtures/buildUpdatedRequest"
import PoliceApiError from "../../PoliceApiError"
import { normalDisposal } from "./normalDisposal"

const personId = "123456"

const request = {
  operation: PncOperation.NORMAL_DISPOSAL,
  request: buildNormalDisposalRequest()
} as PoliceUpdateRequest

describe("normalDisposal", () => {
  it("returns endpoint and requestBody", () => {
    const pncUpdateDataset = buildPncUpdateDataset({ organisationName: "Org" })
    const endpoint = "person-services/v1/people/123456/disposals/ABC123/court-case-disposal-result"
    const requestBody = {
      ownerCode: "07A1",
      personUrn: "1950/123X",
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
          cjsOffenceCode: "SX03001",
          roleQualifiers: ["AT"],
          plea: "No Plea Taken",
          adjudication: "Non-Conviction",
          dateOfSentence: "2025-08-14",
          offenceTic: 3,
          offenceId: "66cdba73-c8a7-426d-a766-02e449843a69",
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
          ]
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
                cjsOffenceCode: "SX03001",
                offenceCodeType: "cjs"
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
                cjsOffenceCode: "TH68006",
                offenceCodeType: "cjs"
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
    const expectedResult = { endpoint, requestBody }

    const result = normalDisposal(request, personId, pncUpdateDataset)

    expect(result).toStrictEqual(expectedResult)
  })

  it("returns error when operation is not normal disposal", () => {
    const request = {
      operation: PncOperation.DISPOSAL_UPDATED,
      request: buildUpdatedRequest()
    } as PoliceUpdateRequest
    const pncUpdateDataset = buildPncUpdateDataset()

    const result = normalDisposal(request, personId, pncUpdateDataset)

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

    const result = normalDisposal(request, personId, pncUpdateDataset)

    expect(result).toBeInstanceOf(PoliceApiError)
    expect((result as PoliceApiError).messages).toContain("Failed to update LEDS due to missing data.")
  })

  it("returns error when zod schema does not match any of the fields", () => {
    const requestWithInvalidData = {
      operation: PncOperation.NORMAL_DISPOSAL,
      request: buildNormalDisposalRequest({ psaCourtCode: "000123" })
    } as PoliceUpdateRequest
    const pncUpdateDataset = buildPncUpdateDataset({ organisationName: "Org" })

    const result = normalDisposal(requestWithInvalidData, personId, pncUpdateDataset)

    expect(result).toBeInstanceOf(PoliceApiError)
    expect((result as PoliceApiError).messages).toContain("Failed to validate LEDS request.")
  })
})
