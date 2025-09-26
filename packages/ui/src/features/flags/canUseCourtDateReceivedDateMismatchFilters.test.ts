import User from "../../services/entities/User"

const mockUseApiModule = (forcesWithCourtDateReceivedDateMismatchEnabled: Set<string>) => {
  jest.doMock("../../config.ts", () => ({
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

  it("returns false when user does not have feature flag enabled", () => {
    mockUseApiModule(enabledForces)

    const { canUseCourtDateReceivedDateMismatchFilters } = require("./canUseCourtDateReceivedDateMismatchFilters")

    const user = new User()
    user.featureFlags = { useCourtDateReceivedDateMismatchFiltersEnabled: false }
    user.visibleForces = [...enabledForces]

    expect(canUseCourtDateReceivedDateMismatchFilters(user)).toBe(false)
  })

  it("returns false when FORCES_WITH_COURT_DATE_RECEIVED_DATE_MISMATCH_ENABLED does not include force", () => {
    mockUseApiModule(enabledForces)

    const { canUseCourtDateReceivedDateMismatchFilters } = require("./canUseCourtDateReceivedDateMismatchFilters")

    const user = new User()
    user.featureFlags = { useCourtDateReceivedDateMismatchFiltersEnabled: true }
    user.visibleForces = ["006"]

    expect(canUseCourtDateReceivedDateMismatchFilters(user)).toBe(false)
  })

  it("returns false when none of the visible forces are enabled", () => {
    mockUseApiModule(enabledForces)

    const { canUseCourtDateReceivedDateMismatchFilters } = require("./canUseCourtDateReceivedDateMismatchFilters")

    const user = new User()
    user.featureFlags = { useCourtDateReceivedDateMismatchFiltersEnabled: true }
    user.visibleForces = ["006", "007"]

    expect(canUseCourtDateReceivedDateMismatchFilters(user)).toBe(false)
  })

  it("returns true when FORCES_WITH_COURT_DATE_RECEIVED_DATE_MISMATCH_ENABLED includes at least one enabled force", () => {
    mockUseApiModule(enabledForces)

    const { canUseCourtDateReceivedDateMismatchFilters } = require("./canUseCourtDateReceivedDateMismatchFilters")

    const user = new User()
    user.featureFlags = { useCourtDateReceivedDateMismatchFiltersEnabled: true }
    user.visibleForces = ["006", "007", "001"]

    expect(canUseCourtDateReceivedDateMismatchFilters(user)).toBe(true)
  })

  it("returns false when FORCES_WITH_COURT_DATE_RECEIVED_DATE_MISMATCH_ENABLED is empty", () => {
    mockUseApiModule(new Set<string>())

    const { canUseCourtDateReceivedDateMismatchFilters } = require("./canUseCourtDateReceivedDateMismatchFilters")

    const user = new User()
    user.featureFlags = { useCourtDateReceivedDateMismatchFiltersEnabled: true }
    user.visibleForces = ["006", "007", "001"]

    expect(canUseCourtDateReceivedDateMismatchFilters(user)).toBe(false)
  })
})
