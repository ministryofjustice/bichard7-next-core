import { ApiEndpoints } from "./canUseEndpoint"

// Utility function to mock the module with different values
const mockUseApiModule = (useApi: boolean, useApiCaseEndpoint: boolean, useApiCaseIndexEndpoint: boolean) => {
  jest.doMock("../../config.ts", () => ({
    USE_API: useApi,
    USE_API_CASE_ENDPOINT: useApiCaseEndpoint,
    USE_API_CASES_INDEX_ENDPOINT: useApiCaseIndexEndpoint
  }))
}

describe("canUseEndpoint", () => {
  beforeEach(() => {
    jest.resetModules() // Reset module registry to clear previous mocks
  })

  afterEach(() => {
    jest.resetModules()
  })

  it("returns false when USE_API is disabled", () => {
    mockUseApiModule(false, true, false)

    // Re-import the module to apply the mock
    const { canUseApiEndpoint } = require("./canUseEndpoint")

    expect(canUseApiEndpoint(ApiEndpoints.CaseDetails)).toBe(false)
  })

  it("returns true when USE_API_CASE_ENDPOINT is enabled", () => {
    mockUseApiModule(true, true, false)

    // Re-import the module to apply the mock
    const { canUseApiEndpoint } = require("./canUseEndpoint")

    expect(canUseApiEndpoint(ApiEndpoints.CaseDetails)).toBe(true)
  })

  it("returns true when USE_API_CASES_INDEX_ENDPOINT is enabled", () => {
    mockUseApiModule(true, false, true)

    // Re-import the module to apply the mock
    const { canUseApiEndpoint } = require("./canUseEndpoint")

    expect(canUseApiEndpoint(ApiEndpoints.CaseList)).toBe(true)
  })

  it("returns false when USE_API_CASE_ENDPOINT is disabled", () => {
    mockUseApiModule(true, false, true)

    const { canUseApiEndpoint } = require("./canUseEndpoint")

    expect(canUseApiEndpoint(ApiEndpoints.CaseDetails)).toBe(false)
  })

  it("returns false when USE_API_CASES_INDEX_ENDPOINT is disabled", () => {
    mockUseApiModule(true, true, false)

    const { canUseApiEndpoint } = require("./canUseEndpoint")

    expect(canUseApiEndpoint(ApiEndpoints.CaseList)).toBe(false)
  })

  it("returns false when both USE_API_CASE_ENDPOINT and USE_API_CASES_INDEX_ENDPOINT are disabled", () => {
    mockUseApiModule(true, false, false)

    const { canUseApiEndpoint } = require("./canUseEndpoint")

    expect(canUseApiEndpoint(ApiEndpoints.CaseDetails)).toBe(false)
    expect(canUseApiEndpoint(ApiEndpoints.CaseList)).toBe(false)
  })

  it("returns false when USE_API is disabled, and USE_API_CASE_ENDPOINT, USE_API_CASES_INDEX_ENDPOINT are enabled", () => {
    mockUseApiModule(false, true, true)

    const { canUseApiEndpoint } = require("./canUseEndpoint")

    expect(canUseApiEndpoint(ApiEndpoints.CaseDetails)).toBe(false)
    expect(canUseApiEndpoint(ApiEndpoints.CaseList)).toBe(false)
  })
})
