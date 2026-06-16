import Permission from "@moj-bichard7/common/types/Permission"

import type { DisplayFullUser } from "@/types/display/Users"

export const canUseAllocation = (user: DisplayFullUser) => {
  if (!user.hasAccessTo[Permission.CanAllocate]) {
    return false
  }

  return true //user.featureFlags.allocationEnabled
}
