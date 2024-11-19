import type User from "services/entities/User"

type displayPartialUserPickedFields = "forenames" | "surname" | "username" | "visibleForces"

export type DisplayPartialUser = Pick<User, displayPartialUserPickedFields>

type displayFullUserPickedFields =
  | "email"
  | "excludedTriggers"
  | "featureFlags"
  | "groups"
  | "hasAccessTo"
  | "visibleCourts"
  | displayPartialUserPickedFields

export type DisplayFullUser = Pick<User, displayFullUserPickedFields>
