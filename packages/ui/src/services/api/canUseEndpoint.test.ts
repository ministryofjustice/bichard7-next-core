import { ApiEndpoints } from "./canUseEndpoint"

const mockUseApiModule = (
  useApi: boolean,
  useApiCaseEndpoint: boolean,
  useApiCaseIndexEndpoint: boolean,
  useApiCaseResubmitEndpoint: boolean,
  forcesWithApiEnabled: Set<string>
) => {
  jest.doMock("../../config.ts", () => ({
    USE_API: useApi,
    USE_API_CASE_ENDPOINT: useApiCaseEndpoint,
    USE_API_CASES_INDEX_ENDPOINT: useApiCaseIndexEndpoint,
    USE_API_CASE_RESUBMIT_ENDPOINT: useApiCaseResubmitEndpoint,
    FORCES_WITH_API_ENABLED: forcesWithApiEnabled
  }))
}

const enabledForces = new Set<string>(["01", "02", "03", "99"])

describe("canUseEndpoint", () => {
  beforeEach(() => {
    jest.resetModules()
  })

  afterEach(() => {
    jest.resetModules()
  })

  it("returns false when USE_API is disabled", () => {
    mockUseApiModule(false, true, false, false, enabledForces)

    const { canUseApiEndpoint } = require("./canUseEndpoint")

    expect(canUseApiEndpoint(ApiEndpoints.CaseDetails, ["01"])).toBe(false)
  })

  it("returns true when USE_API_CASE_ENDPOINT is enabled", () => {
    mockUseApiModule(true, true, false, false, enabledForces)

    const { canUseApiEndpoint } = require("./canUseEndpoint")

    expect(canUseApiEndpoint(ApiEndpoints.CaseDetails, ["01"])).toBe(true)
    expect(canUseApiEndpoint(ApiEndpoints.CaseDetails, ["001"])).toBe(true)
    expect(canUseApiEndpoint(ApiEndpoints.CaseDetails, ["99"])).toBe(true)
    expect(canUseApiEndpoint(ApiEndpoints.CaseDetails, ["099"])).toBe(true)
  })

  it("returns true when USE_API_CASES_INDEX_ENDPOINT is enabled", () => {
    mockUseApiModule(true, false, true, false, enabledForces)

    const { canUseApiEndpoint } = require("./canUseEndpoint")

    expect(canUseApiEndpoint(ApiEndpoints.CaseList, ["01"])).toBe(true)
    expect(canUseApiEndpoint(ApiEndpoints.CaseList, ["001"])).toBe(true)
  })

  it("returns true when USE_API_CASE_RESUBMIT_ENDPOINT is enabled", () => {
    mockUseApiModule(true, false, false, true, enabledForces)

    const { canUseApiEndpoint } = require("./canUseEndpoint")

    expect(canUseApiEndpoint(ApiEndpoints.CaseDetailsCaseResubmit, ["01"])).toBe(true)
    expect(canUseApiEndpoint(ApiEndpoints.CaseDetailsCaseResubmit, ["001"])).toBe(true)
  })

  it("returns false when USE_API_CASE_ENDPOINT is disabled", () => {
    mockUseApiModule(true, false, true, false, enabledForces)

    const { canUseApiEndpoint } = require("./canUseEndpoint")

    expect(canUseApiEndpoint(ApiEndpoints.CaseDetails, ["01"])).toBe(false)
    expect(canUseApiEndpoint(ApiEndpoints.CaseDetails, ["001"])).toBe(false)
  })

  it("returns false when USE_API_CASES_INDEX_ENDPOINT is disabled", () => {
    mockUseApiModule(true, true, false, false, enabledForces)

    const { canUseApiEndpoint } = require("./canUseEndpoint")

    expect(canUseApiEndpoint(ApiEndpoints.CaseList, ["01"])).toBe(false)
    expect(canUseApiEndpoint(ApiEndpoints.CaseList, ["001"])).toBe(false)
  })

  it("returns false when USE_API_CASE_RESUBMIT_ENDPOINT is disabled", () => {
    mockUseApiModule(true, true, true, false, enabledForces)

    const { canUseApiEndpoint } = require("./canUseEndpoint")

    expect(canUseApiEndpoint(ApiEndpoints.CaseDetailsCaseResubmit, ["01"])).toBe(false)
    expect(canUseApiEndpoint(ApiEndpoints.CaseDetailsCaseResubmit, ["001"])).toBe(false)
  })

  it("returns false when both USE_API_CASE_ENDPOINT and USE_API_CASES_INDEX_ENDPOINT are disabled", () => {
    mockUseApiModule(true, false, false, false, enabledForces)

    const { canUseApiEndpoint } = require("./canUseEndpoint")

    expect(canUseApiEndpoint(ApiEndpoints.CaseDetails, ["01"])).toBe(false)
    expect(canUseApiEndpoint(ApiEndpoints.CaseDetails, ["001"])).toBe(false)
    expect(canUseApiEndpoint(ApiEndpoints.CaseList, ["01"])).toBe(false)
    expect(canUseApiEndpoint(ApiEndpoints.CaseList, ["001"])).toBe(false)
  })

  it("returns false when USE_API is disabled, and all other flags are enabled", () => {
    mockUseApiModule(false, true, true, true, enabledForces)

    const { canUseApiEndpoint } = require("./canUseEndpoint")

    expect(canUseApiEndpoint(ApiEndpoints.CaseDetails, ["01"])).toBe(false)
    expect(canUseApiEndpoint(ApiEndpoints.CaseDetails, ["001"])).toBe(false)
    expect(canUseApiEndpoint(ApiEndpoints.CaseList, ["01"])).toBe(false)
    expect(canUseApiEndpoint(ApiEndpoints.CaseList, ["001"])).toBe(false)
  })

  it("returns false when FORCES_WITH_API_ENABLED does not include force", () => {
    mockUseApiModule(true, true, true, false, enabledForces)

    const { canUseApiEndpoint } = require("./canUseEndpoint")

    expect(canUseApiEndpoint(ApiEndpoints.CaseDetails, ["06"])).toBe(false)
    expect(canUseApiEndpoint(ApiEndpoints.CaseDetails, ["006"])).toBe(false)
    expect(canUseApiEndpoint(ApiEndpoints.CaseList, ["06"])).toBe(false)
    expect(canUseApiEndpoint(ApiEndpoints.CaseList, ["006"])).toBe(false)
  })

  it("returns false when none of the visible forces are enabled", () => {
    mockUseApiModule(true, true, true, false, enabledForces)

    const { canUseApiEndpoint } = require("./canUseEndpoint")

    expect(canUseApiEndpoint(ApiEndpoints.CaseDetails, ["06", "07"])).toBe(false)
    expect(canUseApiEndpoint(ApiEndpoints.CaseDetails, ["006", "007"])).toBe(false)
    expect(canUseApiEndpoint(ApiEndpoints.CaseList, ["06", "07"])).toBe(false)
    expect(canUseApiEndpoint(ApiEndpoints.CaseList, ["006", "007"])).toBe(false)
  })

  it("returns true when FORCES_WITH_API_ENABLED includes at least one enabled force", () => {
    mockUseApiModule(true, true, true, false, enabledForces)

    const { canUseApiEndpoint } = require("./canUseEndpoint")

    expect(canUseApiEndpoint(ApiEndpoints.CaseDetails, ["06", "07", "01"])).toBe(true)
    expect(canUseApiEndpoint(ApiEndpoints.CaseDetails, ["006", "007", "001"])).toBe(true)
    expect(canUseApiEndpoint(ApiEndpoints.CaseList, ["06", "07", "01"])).toBe(true)
    expect(canUseApiEndpoint(ApiEndpoints.CaseList, ["006", "007", "001"])).toBe(true)
  })

  it("returns false when empty array of FORCES_WITH_API_ENABLED", () => {
    mockUseApiModule(true, true, true, false, new Set<string>())

    const { canUseApiEndpoint } = require("./canUseEndpoint")

    expect(canUseApiEndpoint(ApiEndpoints.CaseDetails, ["06", "07", "01"])).toBe(false)
    expect(canUseApiEndpoint(ApiEndpoints.CaseDetails, ["006", "007", "001"])).toBe(false)
    expect(canUseApiEndpoint(ApiEndpoints.CaseList, ["06", "07", "01"])).toBe(false)
    expect(canUseApiEndpoint(ApiEndpoints.CaseList, ["006", "007", "001"])).toBe(false)
  })
})
