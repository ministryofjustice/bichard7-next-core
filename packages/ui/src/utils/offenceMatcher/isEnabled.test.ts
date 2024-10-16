import type { DisplayFullUser } from "types/display/Users"
import isEnabled from "./isEnabled"

describe("isEnabled", () => {
  let user: DisplayFullUser

  beforeEach(() => {
    user = {
      username: "GeneralHandler",
      visibleForces: [],
      email: "generalhandler@example.com",
      visibleCourts: [],
      excludedTriggers: [],
      groups: [],
      hasAccessTo: { 0: false, 1: false, 2: false, 3: false, 4: false, 5: false, 6: false },
      featureFlags: {}
    }
  })

  it("returns false with no feature flags", () => {
    const result = isEnabled(user)
    expect(result).toBe(false)
  })

  it("returns false with only exceptionsEnabled feature flag enabled", () => {
    user.featureFlags = { exceptionsEnabled: true }

    const result = isEnabled(user)
    expect(result).toBe(false)
  })

  it("returns false with only offenceMatchingEnabled feature flag enabled", () => {
    user.featureFlags = { offenceMatchingEnabled: true }

    const result = isEnabled(user)
    expect(result).toBe(false)
  })

  it("returns true with exceptionsEnabled and offenceMatchingEnabled feature flag enabled", () => {
    user.featureFlags = { exceptionsEnabled: true, offenceMatchingEnabled: true }

    const result = isEnabled(user)
    expect(result).toBe(true)
  })

  it("returns false with exceptionsEnabled disabled and offenceMatchingEnabled enabled", () => {
    user.featureFlags = { exceptionsEnabled: false, offenceMatchingEnabled: true }

    const result = isEnabled(user)
    expect(result).toBe(false)
  })

  it("returns false with exceptionsEnabled enabled and offenceMatchingEnabled disabled", () => {
    user.featureFlags = { exceptionsEnabled: true, offenceMatchingEnabled: false }

    const result = isEnabled(user)
    expect(result).toBe(false)
  })
})
