import { z } from "zod"

import { UserGroup } from "./UserGroup"

export const UserSchema = z.object({
  email: z.string(),
  excludedTriggers: z.array(z.string()).min(0),
  featureFlags: z.record(z.boolean()),
  forenames: z.string().nullable(),
  groups: z.array(z.nativeEnum(UserGroup)),
  id: z.number(),
  jwtId: z.string().nullable(),
  surname: z.string().nullable(),
  username: z.string(),
  visibleCourts: z.array(z.string()).min(0),
  visibleForces: z.array(z.number()).min(0)
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
  visibleForces: z.array(z.number()).nullable()
})

export type User = z.infer<typeof UserSchema>
export type UserDto = z.infer<typeof UserDtoSchema>
