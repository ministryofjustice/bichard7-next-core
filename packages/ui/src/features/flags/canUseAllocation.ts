import Permission from "@moj-bichard7/common/types/Permission"

import type { DisplayFullUser } from "@/types/display/Users"
import { FORCES_WITH_ALLOCATION_ENABLED } from "@/config"

export const canUseAllocation = (user: DisplayFullUser) => {
  if (!user.hasAccessTo[Permission.CanAllocate]) {
    return false
  }

  if (!user.visibleForces.some((force) => FORCES_WITH_ALLOCATION_ENABLED.has(force))) {
    return false
  }

  return user.featureFlags.allocationEnabled
}
