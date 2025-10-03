import User from "../../services/entities/User"
import { UserGroup } from "@moj-bichard7/common/types/UserGroup"

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
    user.groups = [UserGroup.Supervisor]

    expect(canUseTriggerAndExceptionQualityAuditing(user)).toBe(false)
  })

  it("returns false when FORCES_WITH_TRIGGER_AND_EXCEPTION_QUALITY_AUDITING_ENABLED does not include force", () => {
    mockUseApiModule(enabledForces)

    const { canUseTriggerAndExceptionQualityAuditing } = require("./canUseTriggerAndExceptionQualityAuditing")

    const user = new User()
    user.featureFlags = { useTriggerAndExceptionQualityAuditingEnabled: true }
    user.visibleForces = ["006"]
    user.groups = [UserGroup.Supervisor]

    expect(canUseTriggerAndExceptionQualityAuditing(user)).toBe(false)
  })

  it("returns false when none of the visible forces are enabled", () => {
    mockUseApiModule(enabledForces)

    const { canUseTriggerAndExceptionQualityAuditing } = require("./canUseTriggerAndExceptionQualityAuditing")

    const user = new User()
    user.featureFlags = { useTriggerAndExceptionQualityAuditingEnabled: true }
    user.visibleForces = ["006", "007"]
    user.groups = [UserGroup.Supervisor]

    expect(canUseTriggerAndExceptionQualityAuditing(user)).toBe(false)
  })

  it("returns true when FORCES_WITH_TRIGGER_AND_EXCEPTION_QUALITY_AUDITING_ENABLED includes at least one enabled force", () => {
    mockUseApiModule(enabledForces)

    const { canUseTriggerAndExceptionQualityAuditing } = require("./canUseTriggerAndExceptionQualityAuditing")

    const user = new User()
    user.featureFlags = { useTriggerAndExceptionQualityAuditingEnabled: true }
    user.visibleForces = ["006", "007", "001"]
    user.groups = [UserGroup.Supervisor]

    expect(canUseTriggerAndExceptionQualityAuditing(user)).toBe(true)
  })

  it("returns false when FORCES_WITH_TRIGGER_AND_EXCEPTION_QUALITY_AUDITING_ENABLED is empty", () => {
    mockUseApiModule(new Set<string>())

    const { canUseTriggerAndExceptionQualityAuditing } = require("./canUseTriggerAndExceptionQualityAuditing")

    const user = new User()
    user.featureFlags = { useTriggerAndExceptionQualityAuditingEnabled: true }
    user.visibleForces = ["006", "007", "001"]
    user.groups = [UserGroup.Supervisor]

    expect(canUseTriggerAndExceptionQualityAuditing(user)).toBe(false)
  })

  it("returns false when user groups does not include Supervisor", () => {
    mockUseApiModule(enabledForces)

    const { canUseTriggerAndExceptionQualityAuditing } = require("./canUseTriggerAndExceptionQualityAuditing")

    const user = new User()
    user.featureFlags = { useTriggerAndExceptionQualityAuditingEnabled: true }
    user.visibleForces = ["006", "007", "001"]

    expect(canUseTriggerAndExceptionQualityAuditing(user)).toBe(false)
  })

  it("returns true when user groups includes Supervisor", () => {
    mockUseApiModule(enabledForces)

    const { canUseTriggerAndExceptionQualityAuditing } = require("./canUseTriggerAndExceptionQualityAuditing")

    const user = new User()
    user.featureFlags = { useTriggerAndExceptionQualityAuditingEnabled: true }
    user.visibleForces = ["006", "007", "001"]
    user.groups = [UserGroup.Supervisor]

    expect(canUseTriggerAndExceptionQualityAuditing(user)).toBe(true)
  })
})
