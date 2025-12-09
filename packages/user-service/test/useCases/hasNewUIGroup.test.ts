import { hasNewUIGroup } from "useCases/hasNewUIGroup"
import type { UserGroupResult } from "types/UserGroup"

describe("hasNewUIGroup", () => {
  const allGroups = [
    { friendly_name: "Allocator" },
    { friendly_name: "Supervisor" },
    { friendly_name: "Audit" }
  ] as UserGroupResult[]

  const userGroups = [{ friendly_name: "Supervisor" }, { friendly_name: "New Bichard UI" }] as UserGroupResult[]

  it("should return true when B7NewUI is in userGroups but not in allGroups", () => {
    const result = hasNewUIGroup(userGroups, allGroups)
    expect(result).toBe(true)
  })

  it("should return false when B7NewUI is not in userGroups", () => {
    const result = hasNewUIGroup([{ friendly_name: "Supervisor" }] as UserGroupResult[], allGroups)
    expect(result).toBe(false)
  })

  it("should return false when B7NewUI is in both lists", () => {
    const allGroupsWithNewUI = [...allGroups, { friendly_name: "New Bichard UI" }] as UserGroupResult[]
    const result = hasNewUIGroup(userGroups, allGroupsWithNewUI)
    expect(result).toBe(false)
  })

  it("should return false when B7NewUI is only in allGroups", () => {
    const allGroupsWithNewUI = [...allGroups, { friendly_name: "New Bichard UI" }] as UserGroupResult[]
    const result = hasNewUIGroup([{ friendly_name: "Supervisor" }] as UserGroupResult[], allGroupsWithNewUI)
    expect(result).toBe(false)
  })

  it("should return false when userGroups is empty", () => {
    const result = hasNewUIGroup([], allGroups)
    expect(result).toBe(false)
  })
})
