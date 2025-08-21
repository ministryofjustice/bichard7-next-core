import { ApiEndpoints } from "./canUseEndpoint"

const mockUseApiModule = (
  useApi: boolean,
  useApiCaseEndpoint: boolean,
  useApiCaseIndexEndpoint: boolean,
  forcesWithApiEnabled: Set<string>
) => {
  jest.doMock("../../config.ts", () => ({
    USE_API: useApi,
    USE_API_CASE_ENDPOINT: useApiCaseEndpoint,
    USE_API_CASES_INDEX_ENDPOINT: useApiCaseIndexEndpoint,
    FORCES_WITH_API_ENABLED: forcesWithApiEnabled
  }))
}

const enabledForces = new Set<string>(["01", "02", "03"])

describe("canUseEndpoint", () => {
  beforeEach(() => {
    jest.resetModules()
  })

  afterEach(() => {
    jest.resetModules()
  })

  it("returns false when USE_API is disabled", () => {
    mockUseApiModule(false, true, false, enabledForces)

    const { canUseApiEndpoint } = require("./canUseEndpoint")

    expect(canUseApiEndpoint(ApiEndpoints.CaseDetails, ["01"])).toBe(false)
  })

  it("returns true when USE_API_CASE_ENDPOINT is enabled", () => {
    mockUseApiModule(true, true, false, enabledForces)

    const { canUseApiEndpoint } = require("./canUseEndpoint")

    expect(canUseApiEndpoint(ApiEndpoints.CaseDetails, ["01"])).toBe(true)
  })

  it("returns true when USE_API_CASES_INDEX_ENDPOINT is enabled", () => {
    mockUseApiModule(true, false, true, enabledForces)

    const { canUseApiEndpoint } = require("./canUseEndpoint")

    expect(canUseApiEndpoint(ApiEndpoints.CaseList, ["01"])).toBe(true)
  })

  it("returns false when USE_API_CASE_ENDPOINT is disabled", () => {
    mockUseApiModule(true, false, true, enabledForces)

    const { canUseApiEndpoint } = require("./canUseEndpoint")

    expect(canUseApiEndpoint(ApiEndpoints.CaseDetails, ["01"])).toBe(false)
  })

  it("returns false when USE_API_CASES_INDEX_ENDPOINT is disabled", () => {
    mockUseApiModule(true, true, false, enabledForces)

    const { canUseApiEndpoint } = require("./canUseEndpoint")

    expect(canUseApiEndpoint(ApiEndpoints.CaseList, ["01"])).toBe(false)
  })

  it("returns false when both USE_API_CASE_ENDPOINT and USE_API_CASES_INDEX_ENDPOINT are disabled", () => {
    mockUseApiModule(true, false, false, enabledForces)

    const { canUseApiEndpoint } = require("./canUseEndpoint")

    expect(canUseApiEndpoint(ApiEndpoints.CaseDetails, ["01"])).toBe(false)
    expect(canUseApiEndpoint(ApiEndpoints.CaseList, ["01"])).toBe(false)
  })

  it("returns false when USE_API is disabled, and USE_API_CASE_ENDPOINT, USE_API_CASES_INDEX_ENDPOINT are enabled", () => {
    mockUseApiModule(false, true, true, enabledForces)

    const { canUseApiEndpoint } = require("./canUseEndpoint")

    expect(canUseApiEndpoint(ApiEndpoints.CaseDetails, ["01"])).toBe(false)
    expect(canUseApiEndpoint(ApiEndpoints.CaseList, ["01"])).toBe(false)
  })

  it("returns false when FORCES_WITH_API_ENABLED does not include force", () => {
    mockUseApiModule(true, true, true, enabledForces)

    const { canUseApiEndpoint } = require("./canUseEndpoint")

    expect(canUseApiEndpoint(ApiEndpoints.CaseDetails, ["06"])).toBe(false)
    expect(canUseApiEndpoint(ApiEndpoints.CaseList, ["06"])).toBe(false)
  })

  it("returns false when FORCES_WITH_API_ENABLED does not include multiple forces", () => {
    mockUseApiModule(true, true, true, enabledForces)

    const { canUseApiEndpoint } = require("./canUseEndpoint")

    expect(canUseApiEndpoint(ApiEndpoints.CaseDetails, ["06", "07"])).toBe(false)
    expect(canUseApiEndpoint(ApiEndpoints.CaseList, ["06", "07"])).toBe(false)
  })

  it("returns true when FORCES_WITH_API_ENABLED includes at least one enabled force", () => {
    mockUseApiModule(true, true, true, enabledForces)

    const { canUseApiEndpoint } = require("./canUseEndpoint")

    expect(canUseApiEndpoint(ApiEndpoints.CaseDetails, ["06", "07", "01"])).toBe(true)
    expect(canUseApiEndpoint(ApiEndpoints.CaseList, ["06", "07", "01"])).toBe(true)
  })
})
