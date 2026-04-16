import type User from "../../services/entities/User"
import { UserGroup } from "@moj-bichard7/common/types/UserGroup"
import { canUseTriggerAndExceptionQualityAuditing } from "./canUseTriggerAndExceptionQualityAuditing"

describe("canUseTriggerAndExceptionQualityAuditing", () => {
  it("returns false when user does not have feature flag enabled", () => {
    const user = {
      groups: [UserGroup.Supervisor],
      featureFlags: { useTriggerAndExceptionQualityAuditingEnabled: false }
    } as unknown as User

    expect(canUseTriggerAndExceptionQualityAuditing(user)).toBe(false)
  })

  it("returns false when user groups does not include Supervisor", () => {
    const user = {
      groups: [UserGroup.GeneralHandler],
      featureFlags: { useTriggerAndExceptionQualityAuditingEnabled: true }
    } as unknown as User

    expect(canUseTriggerAndExceptionQualityAuditing(user)).toBe(false)
  })

  it("returns true when user groups includes Supervisor and feature flag is set to true", () => {
    const user = {
      groups: [UserGroup.Supervisor],
      featureFlags: { useTriggerAndExceptionQualityAuditingEnabled: true }
    } as unknown as User

    expect(canUseTriggerAndExceptionQualityAuditing(user)).toBe(true)
  })
})
