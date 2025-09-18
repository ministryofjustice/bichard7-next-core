import User from "../../services/entities/User"

const mockUseApiModule = (forcesWithTriggerAndExceptionQualityAuditingEnabled: Set<string>) => {
  jest.doMock("../../config.ts", () => ({
    FORCES_WITH_TRIGGER_AND_EXCEPTION_QUALITY_AUDITING_ENABLED: forcesWithTriggerAndExceptionQualityAuditingEnabled
  }))
}

const enabledForces = new Set<string>(["01", "02", "03"])

describe("canUseTriggerAndExceptionQualityAuditing", () => {
  beforeEach(() => {
    jest.resetModules()
  })

  afterEach(() => {
    jest.resetModules()
  })

  it("returns false when user does not have feature flag enabled", () => {
    mockUseApiModule(enabledForces)

    const { canUseTriggerAndExceptionQualityAuditing } = require("./canUseTriggerAndExceptionQualityAuditing")

    const user = new User()
    user.featureFlags = { useTriggerAndExceptionQualityAuditingEnabled: false }
    user.visibleForces = [...enabledForces]

    expect(canUseTriggerAndExceptionQualityAuditing(user)).toBe(false)
  })

  it("returns false when FORCES_WITH_TRIGGER_AND_EXCEPTION_QUALITY_AUDITING_ENABLED does not include force", () => {
    mockUseApiModule(enabledForces)

    const { canUseTriggerAndExceptionQualityAuditing } = require("./canUseTriggerAndExceptionQualityAuditing")

    const user = new User()
    user.featureFlags = { useTriggerAndExceptionQualityAuditingEnabled: true }
    user.visibleForces = ["06"]

    expect(canUseTriggerAndExceptionQualityAuditing(user)).toBe(false)
  })

  it("returns false when none of the visible forces are enabled", () => {
    mockUseApiModule(enabledForces)

    const { canUseTriggerAndExceptionQualityAuditing } = require("./canUseTriggerAndExceptionQualityAuditing")

    const user = new User()
    user.featureFlags = { useTriggerAndExceptionQualityAuditingEnabled: true }
    user.visibleForces = ["06", "07"]

    expect(canUseTriggerAndExceptionQualityAuditing(user)).toBe(false)
  })

  it("returns true when FORCES_WITH_TRIGGER_AND_EXCEPTION_QUALITY_AUDITING_ENABLED includes at least one enabled force", () => {
    mockUseApiModule(enabledForces)

    const { canUseTriggerAndExceptionQualityAuditing } = require("./canUseTriggerAndExceptionQualityAuditing")

    const user = new User()
    user.featureFlags = { useTriggerAndExceptionQualityAuditingEnabled: true }
    user.visibleForces = ["06", "07", "01"]

    expect(canUseTriggerAndExceptionQualityAuditing(user)).toBe(true)
  })

  it("returns false when FORCES_WITH_TRIGGER_AND_EXCEPTION_QUALITY_AUDITING_ENABLED is empty", () => {
    mockUseApiModule(new Set<string>())

    const { canUseTriggerAndExceptionQualityAuditing } = require("./canUseTriggerAndExceptionQualityAuditing")

    const user = new User()
    user.featureFlags = { useTriggerAndExceptionQualityAuditingEnabled: true }
    user.visibleForces = ["06", "07", "01"]

    expect(canUseTriggerAndExceptionQualityAuditing(user)).toBe(false)
  })
})
