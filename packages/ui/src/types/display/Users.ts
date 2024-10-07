import User from "services/entities/User"

type displayPartialUserPickedFields = "username" | "forenames" | "surname" | "visibleForces"

export type DisplayPartialUser = Pick<User, displayPartialUserPickedFields>

type displayFullUserPickedFields =
  | displayPartialUserPickedFields
  | "email"
  | "visibleCourts"
  | "excludedTriggers"
  | "featureFlags"
  | "groups"
  | "hasAccessTo"

export type DisplayFullUser = Pick<User, displayFullUserPickedFields>
