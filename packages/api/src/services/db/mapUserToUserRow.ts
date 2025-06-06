import type { User, UserRow } from "@moj-bichard7/common/types/User"

const mapUserToUserRow = (user: User): UserRow => ({
  email: user.email,
  excluded_triggers: user.excludedTriggers.join(","),
  feature_flags: user.featureFlags,
  forenames: user.forenames,
  groups: user.groups,
  id: user.id,
  jwt_id: user.jwtId,
  surname: user.surname,
  username: user.username,
  visible_courts: user.visibleCourts.join(","),
  visible_forces: user.visibleForces.map((f) => String(f).padStart(3, "0")).join(",")
})

export default mapUserToUserRow
