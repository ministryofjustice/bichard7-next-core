const mockUseApiModule = (forcesWithCourtDateReceivedDateMismatchEnabled: Set<string>) => {
  jest.doMock("../config.ts", () => ({
    FORCES_WITH_COURT_DATE_RECEIVED_DATE_MISMATCH_ENABLED: forcesWithCourtDateReceivedDateMismatchEnabled
  }))
}

const enabledForces = new Set<string>(["01", "02", "03"])

describe("canUseCourtDateReceivedDateMismatchFilters", () => {
  beforeEach(() => {
    jest.resetModules()
  })

  afterEach(() => {
    jest.resetModules()
  })

  it("returns false when FORCES_WITH_COURT_DATE_RECEIVED_DATE_MISMATCH_ENABLED does not include force", () => {
    mockUseApiModule(enabledForces)

    const { canUseCourtDateReceivedDateMismatchFilters } = require("./canUseCourtDateReceivedDateMismatchFilters")

    expect(canUseCourtDateReceivedDateMismatchFilters(["06"])).toBe(false)
  })

  it("returns false when none of the visible forces are enabled", () => {
    mockUseApiModule(enabledForces)

    const { canUseCourtDateReceivedDateMismatchFilters } = require("./canUseCourtDateReceivedDateMismatchFilters")

    expect(canUseCourtDateReceivedDateMismatchFilters(["06", "07"])).toBe(false)
  })

  it("returns true when FORCES_WITH_COURT_DATE_RECEIVED_DATE_MISMATCH_ENABLED includes at least one enabled force", () => {
    mockUseApiModule(enabledForces)

    const { canUseCourtDateReceivedDateMismatchFilters } = require("./canUseCourtDateReceivedDateMismatchFilters")

    expect(canUseCourtDateReceivedDateMismatchFilters(["06", "07", "01"])).toBe(true)
  })

  it("returns false when empty array of FORCES_WITH_COURT_DATE_RECEIVED_DATE_MISMATCH_ENABLED", () => {
    mockUseApiModule(new Set<string>())

    const { canUseCourtDateReceivedDateMismatchFilters } = require("./canUseCourtDateReceivedDateMismatchFilters")

    expect(canUseCourtDateReceivedDateMismatchFilters(["06", "07", "01"])).toBe(false)
  })
})
