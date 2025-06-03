import type { User, UserRow } from "@moj-bichard7/common/types/User"

import formatForceNumbers from "../formatForceNumbers"

const mapUserRowToUser = (userRow: UserRow): User => ({
  email: userRow.email,
  excludedTriggers: userRow.excluded_triggers?.split(",").filter(Boolean) ?? [],
  featureFlags: userRow.feature_flags,
  forenames: userRow.forenames,
  groups: userRow.groups,
  id: userRow.id,
  jwtId: userRow.jwt_id,
  surname: userRow.surname,
  username: userRow.username,
  visibleCourts: userRow.visible_courts?.split(",").filter(Boolean) ?? [],
  visibleForces: formatForceNumbers(userRow.visible_forces)
})

export default mapUserRowToUser
