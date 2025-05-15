import type { NoteUserDto } from "@moj-bichard7/common/types/Note"
import type { User, UserDto } from "@moj-bichard7/common/types/User"

import { userAccess } from "@moj-bichard7/common/utils/userPermissions"

import type { NoteUser } from "../../types/NoteUser"

export const convertUserForNoteToDto = (user: NoteUser): NoteUserDto => {
  return {
    forenames: user.forenames,
    surname: user.surname,
    username: user.username,
    visibleForces: user.visibleForces
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
    excludedTriggers: user.excludedTriggers.join(","),
    featureFlags: user.featureFlags,
    fullname,
    groups: user.groups,
    hasAccessTo: userAccess(user),
    visibleCourts: user.visibleCourts.join(",")
  } satisfies UserDto
}
