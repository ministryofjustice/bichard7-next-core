import { PncOperation } from "@moj-bichard7/common/types/PncOperation"

import type PoliceUpdateRequest from "../../../../phase3/types/PoliceUpdateRequest"

import { buildNormalDisposalRequest } from "../../../../tests/fixtures/buildNormalDisposalRequest"
import { buildRemandRequest } from "../../../../tests/fixtures/buildRemandRequest"
import PoliceApiError from "../../PoliceApiError"
import endpoints from "../endpoints"
import { remand } from "./remand"

const personId = "123"
const reportId = "456"
const request = {
  operation: PncOperation.REMAND,
  request: buildRemandRequest()
} as PoliceUpdateRequest

describe("remand", () => {
  it("returns endpoint and requestBody", () => {
    const endpoint = "/people/123/arrest-reports/456/basic-remands"
    const requestBody = {
      appearanceResult: "remanded-on-bail",
      bailConditions: ["This is a dummy bail condition."],
      checkName: "CHECKNAME",
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
      personUrn: "2000/0448754K",
      remandDate: "2024-12-05"
    }
    const expectedResult = { endpoint, requestBody }

    const result = remand(request, personId, reportId)

    expect(result).toStrictEqual(expectedResult)
  })

  it("returns error when operation is not remand", () => {
    const normalDisposalRequest = {
      operation: PncOperation.NORMAL_DISPOSAL,
      request: buildNormalDisposalRequest()
    } as PoliceUpdateRequest

    const result = remand(normalDisposalRequest, personId, reportId)

    expect(result).toBeInstanceOf(PoliceApiError)
    expect((result as PoliceApiError).messages).toContain("mapToRemandRequest called with a non-remand request")
  })

  it("returns error when zod schema does not match any of the fields", () => {
    const requestWithInvalidData = {
      operation: PncOperation.REMAND,
      request: buildRemandRequest({ pncIdentifier: "" })
    } as PoliceUpdateRequest

    const x = buildRemandRequest()
    x.pncIdentifier = ""

    const result = remand(requestWithInvalidData, personId, reportId)

    expect(result).toBeInstanceOf(PoliceApiError)
    expect((result as PoliceApiError).messages).toContain("Failed to validate LEDS request.")
  })
})
