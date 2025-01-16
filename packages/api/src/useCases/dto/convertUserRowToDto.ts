import type { FullUserRow, PartialUserRow, UserDto, UserPartialDto } from "@moj-bichard7/common/types/User"

import { userAccess } from "@moj-bichard7/common/utils/userPermissions"

export const convertPartialUserRowToDto = (userRow: PartialUserRow): UserPartialDto => {
  let fullname: string | undefined

  if (userRow.forenames || userRow.surname) {
    fullname = `${userRow.forenames} ${userRow.surname}`
  }

  return {
    forenames: userRow.forenames,
    fullname,
    surname: userRow.surname,
    username: userRow.username,
    visibleForces: userRow.visible_forces
  } satisfies UserPartialDto
}

export const convertUserRowToDto = (userRow: FullUserRow): UserDto => {
  return {
    ...convertPartialUserRowToDto(userRow),
    email: userRow.email,
    excludedTriggers: userRow.excluded_triggers ?? undefined,
    featureFlags: userRow.feature_flags,
    groups: userRow.groups,
    hasAccessTo: userAccess(userRow),
    visibleCourts: userRow.visible_courts ?? undefined
  } satisfies UserDto
}
