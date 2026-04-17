import { PncOperation } from "@moj-bichard7/common/types/PncOperation"

import type PoliceUpdateRequest from "../../../../phase3/types/PoliceUpdateRequest"

import { buildNormalDisposalRequest } from "../../../../tests/fixtures/buildNormalDisposalRequest"
import { buildPncUpdateDataset } from "../../../../tests/fixtures/buildPncUpdateDataset"
import { buildRemandRequest } from "../../../../tests/fixtures/buildRemandRequest"
import PoliceApiError from "../../PoliceApiError"
import { remand } from "./remand"

const personId = "123"
const reportId = "456"
const request = {
  operation: PncOperation.REMAND,
  request: buildRemandRequest()
} as PoliceUpdateRequest

describe("remand", () => {
  const pncUpdateDataset = buildPncUpdateDataset({ organisationName: "Org" })

  it("returns endpoint and requestBody", () => {
    const endpoint = "person-services/v1/people/123/arrest-reports/456/basic-remands"
    const requestBody = {
      appearanceResult: "remanded-on-bail",
      bailConditions: ["This is a dummy bail condition.\n\n\n"],
      currentAppearance: {
        court: {
          courtIdentityType: "code",
          courtCode: "2063"
        }
      },
      nextAppearance: {
        court: {
          courtIdentityType: "code",
          courtCode: "2063"
        },
        date: "2024-12-11"
      },
      ownerCode: "02YZ",
      personUrn: "1950/123X",
      remandDate: "2024-12-05"
    }
    const expectedResult = { endpoint, requestBody }

    const result = remand(request, personId, reportId, pncUpdateDataset)

    expect(result).toStrictEqual(expectedResult)
  })

  it("returns error when operation is not remand", () => {
    const normalDisposalRequest = {
      operation: PncOperation.NORMAL_DISPOSAL,
      request: buildNormalDisposalRequest()
    } as PoliceUpdateRequest

    const result = remand(normalDisposalRequest, personId, reportId, pncUpdateDataset)

    expect(result).toBeInstanceOf(PoliceApiError)
    expect((result as PoliceApiError).messages).toContain("mapToRemandRequest called with a non-remand request")
  })

  it("returns error when zod schema does not match any of the fields", () => {
    const requestWithInvalidData = {
      operation: PncOperation.REMAND,
      request: buildRemandRequest()
    } as PoliceUpdateRequest

    const pncUpdateDatasetWithMissingPersonUrn = buildPncUpdateDataset()
    pncUpdateDatasetWithMissingPersonUrn.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.PNCIdentifier = ""

    const result = remand(requestWithInvalidData, personId, reportId, pncUpdateDatasetWithMissingPersonUrn)

    expect(result).toBeInstanceOf(PoliceApiError)
    expect((result as PoliceApiError).messages).toContain("Failed to validate LEDS request.")
  })
})
