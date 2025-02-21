import { z } from "zod"

import { UserGroup } from "./UserGroup"

export const UserSchema = z.object({
  email: z.string(),
  excluded_triggers: z.string().nullable(),
  feature_flags: z.record(z.boolean()),
  forenames: z.string().nullable(),
  groups: z.array(z.nativeEnum(UserGroup)),
  id: z.number(),
  jwt_id: z.string().nullable(),
  surname: z.string().nullable(),
  username: z.string(),
  visible_courts: z.string().nullable(),
  visible_forces: z.string().nullable()
})

export const UserDtoSchema = z.object({
  email: z.string(),
  excludedTriggers: z.string().optional(),
  featureFlags: z.record(z.boolean()),
  forenames: z.string().nullable(),
  fullname: z.string().optional(),
  groups: z.array(z.nativeEnum(UserGroup)),
  hasAccessTo: z.record(z.boolean()),
  surname: z.string().nullable(),
  username: z.string(),
  visibleCourts: z.string().optional(),
  visibleForces: z.array(z.string()).nullable()
})

export type User = z.infer<typeof UserSchema>
export type UserDto = z.infer<typeof UserDtoSchema>
