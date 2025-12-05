import type { UserGroupResult } from "types/UserGroup"

export const hasNewUIGroup = (userGroups: UserGroupResult[], allGroups: UserGroupResult[]): boolean => {
  const inUserGroups = userGroups.some((group) => group.friendly_name === "New Bichard UI")
  const inAllGroups = allGroups.some((group) => group.friendly_name === "New Bichard UI")

  return inUserGroups && !inAllGroups
}
