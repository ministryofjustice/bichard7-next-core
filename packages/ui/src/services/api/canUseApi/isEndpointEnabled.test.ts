import { ApiEndpoints } from "../types"
import type { ApiEndpointValue } from "../types"
import { isEndpointEnabled } from "./isEndpointEnabled"

jest.mock("config", () => ({
  USE_API_CASE_ENDPOINT: true,
  USE_API_CASES_INDEX_ENDPOINT: true,
  USE_API_CASE_RESUBMIT_ENDPOINT: true
}))

describe("isEndpointEnabled", () => {
  it("should return true for enabled endpoints", () => {
    expect(isEndpointEnabled(ApiEndpoints.CaseDetails)).toBe(true)
    expect(isEndpointEnabled(ApiEndpoints.CaseList)).toBe(true)
    expect(isEndpointEnabled(ApiEndpoints.CaseResubmit)).toBe(true)
  })

  it("should return false for unknown endpoints", () => {
    expect(isEndpointEnabled("UnknownEndpoint" as ApiEndpointValue)).toBe(false)
  })
})
