import type { NoteUserDto } from "@moj-bichard7/common/types/Note"
import type { User, UserDto } from "@moj-bichard7/common/types/User"

import { userAccess } from "@moj-bichard7/common/utils/userPermissions"

import type { NoteUser } from "../../types/NoteUser"

export const convertUserForNoteToDto = (user: NoteUser): NoteUserDto => {
  return {
    forenames: user.forenames,
    surname: user.surname,
    username: user.username,
    visibleForces: user.visible_forces ? user.visible_forces?.split(",") : null
  } satisfies NoteUserDto
}

export const convertUserToDto = (user: User): UserDto => {
  let fullname: string | undefined

  if (user.forenames && user.surname) {
    fullname = `${user.forenames} ${user.surname}`
  }

  return {
    ...convertUserForNoteToDto(user),
    email: user.email,
    excludedTriggers: user.excluded_triggers ?? undefined,
    featureFlags: user.feature_flags,
    fullname,
    groups: user.groups,
    hasAccessTo: userAccess(user),
    visibleCourts: user.visible_courts ?? undefined
  } satisfies UserDto
}
