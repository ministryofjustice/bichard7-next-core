import type User from "services/entities/User"
import type { DisplayFullUser, DisplayPartialUser } from "types/display/Users"

export const userToDisplayFullUserDto = (user: User): DisplayFullUser => {
  const currentUser: DisplayFullUser = {
    email: user.email,
    excludedTriggers: user.excludedTriggers,
    featureFlags: user.featureFlags ?? null,
    forenames: user.forenames,
    groups: user.groups,
    hasAccessTo: user.hasAccessTo,
    surname: user.surname,
    username: user.username,
    visibleCourts: user.visibleCourts,
    visibleForces: user.visibleForces
  }

  return currentUser
}

export const userToDisplayPartialUserDto = (user: User): DisplayPartialUser => {
  const currentUser: DisplayPartialUser = {
    forenames: user.forenames,
    surname: user.surname,
    username: user.username,
    visibleForces: user.visibleForces
  }

  return currentUser
}
