import type { UserMinimal, UserMinimalRow } from "@moj-bichard7/common/types/User"

import formatForceNumbers from "../formatForceNumbers"

const mapUserMinimalRowToMinimalUser = (userMinimalRow: UserMinimalRow): UserMinimal => ({
  deletedAt: userMinimalRow.deleted_at ?? null,
  groups: userMinimalRow.groups,
  id: userMinimalRow.id,
  username: userMinimalRow.username,
  visibleCourts: userMinimalRow.visible_courts?.split(",").filter(Boolean) ?? [],
  visibleForces: formatForceNumbers(userMinimalRow.visible_forces).map((f) => String(f).padStart(2, "0"))
})

export default mapUserMinimalRowToMinimalUser
