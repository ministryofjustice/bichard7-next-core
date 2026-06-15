import Permission from "@moj-bichard7/common/types/Permission"

import { canUseAllocation } from "./canUseAllocation"
import type { DisplayFullUser } from "@/types/display/Users"

jest.mock("@/config", () => ({
  FORCES_WITH_ALLOCATION_ENABLED: new Set(["01", "02", "03"])
}))

const buildUser = (overrides: Partial<DisplayFullUser> = {}): DisplayFullUser =>
  ({
    hasAccessTo: {
      [Permission.CanAllocate]: true
    },
    visibleForces: ["01"],
    featureFlags: {
      allocationEnabled: true
    },
    ...overrides
  }) as unknown as DisplayFullUser

describe("canUseAllocation", () => {
  afterAll(() => {
    jest.restoreAllMocks()
  })

  describe("when the user lacks the CanAllocate permission", () => {
    it("returns false", () => {
      const user = buildUser({
        // @ts-ignore
        hasAccessTo: { [Permission.CanAllocate]: false }
      })

      expect(canUseAllocation(user)).toBe(false)
    })
  })

  describe("when the user has the CanAllocate permission", () => {
    describe("and none of the user's visible forces have allocation enabled", () => {
      it("returns false", () => {
        const user = buildUser({ visibleForces: ["99", "88"] })

        expect(canUseAllocation(user)).toBe(false)
      })
    })

    describe("and the user has no visible forces", () => {
      it("returns false", () => {
        const user = buildUser({ visibleForces: [] })

        expect(canUseAllocation(user)).toBe(false)
      })
    })

    describe("and at least one visible force has allocation enabled", () => {
      it("returns the value of the allocationEnabled feature flag when true", () => {
        const user = buildUser({
          visibleForces: ["99", "02"],
          featureFlags: { allocationEnabled: true }
        })

        expect(canUseAllocation(user)).toBe(true)
      })

      it("returns the value of the allocationEnabled feature flag when false", () => {
        const user = buildUser({
          visibleForces: ["01"],
          featureFlags: { allocationEnabled: false }
        })

        expect(canUseAllocation(user)).toBe(false)
      })

      it("matches when all visible forces are in the enabled set", () => {
        const user = buildUser({
          visibleForces: ["01", "02", "03"],
          featureFlags: { allocationEnabled: true }
        })

        expect(canUseAllocation(user)).toBe(true)
      })

      it("matches when only one of several forces is in the enabled set", () => {
        const user = buildUser({
          visibleForces: ["99", "02", "88"],
          featureFlags: { allocationEnabled: true }
        })

        expect(canUseAllocation(user)).toBe(true)
      })
    })
  })
})
