import User from "services/entities/User"
import { DisplayFullUser, DisplayPartialUser } from "types/display/Users"

export const userToDisplayFullUserDto = (user: User): DisplayFullUser => {
  const currentUser: DisplayFullUser = {
    username: user.username,
    email: user.email,
    forenames: user.forenames,
    surname: user.surname,
    visibleForces: user.visibleForces,
    visibleCourts: user.visibleCourts,
    excludedTriggers: user.excludedTriggers,
    featureFlags: user.featureFlags ?? null,
    groups: user.groups,
    hasAccessTo: user.hasAccessTo
  }

  return currentUser
}

export const userToDisplayPartialUserDto = (user: User): DisplayPartialUser => {
  const currentUser: DisplayPartialUser = {
    username: user.username,
    forenames: user.forenames,
    surname: user.surname,
    visibleForces: user.visibleForces
  }

  return currentUser
}
