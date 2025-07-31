import type { NoteUserDto, NoteUserRow } from "@moj-bichard7/common/types/Note"
import type { User, UserDto } from "@moj-bichard7/common/types/User"

import { userAccess } from "@moj-bichard7/common/utils/userPermissions"

import type { NoteUser } from "../../types/NoteUser"

import formatForceNumbers from "../../services/formatForceNumbers"

export const convertNoteUserRowToNoteUserDto = (user: NoteUserRow): NoteUserDto => {
  return {
    forenames: user.forenames,
    surname: user.surname,
    username: user.username,
    visibleForces: formatForceNumbers(user.visible_forces).map((f) => String(f).padStart(2, "0"))
  }
}

export const convertNoteUserRowToNoteUser = (user: NoteUserRow): NoteUser => {
  return {
    forenames: user.forenames,
    surname: user.surname,
    username: user.username,
    visibleForces: formatForceNumbers(user.visible_forces).map((f) => String(f).padStart(2, "0"))
  }
}

export const convertNoteUserToNoteUserRow = (user: NoteUser): NoteUserRow => {
  return {
    forenames: user.forenames,
    surname: user.surname,
    username: user.username,
    visible_forces: user.visibleForces.map((f) => String(f).padStart(3, "0")).join(",")
  }
}

export const convertUserToDto = (user: User): UserDto => {
  let fullname: string | undefined

  if (user.forenames && user.surname) {
    fullname = `${user.forenames} ${user.surname}`
  }

  return {
    email: user.email,
    excludedTriggers: user.excludedTriggers.join(","),
    featureFlags: user.featureFlags,
    forenames: user.forenames,
    fullname,
    groups: user.groups,
    hasAccessTo: userAccess(user),
    surname: user.surname,
    username: user.username,
    visibleCourts: user.visibleCourts.join(","),
    visibleForces: user.visibleForces
  } satisfies UserDto
}
