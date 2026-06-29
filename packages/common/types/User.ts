import { z } from "zod"

import { UserGroup } from "./UserGroup"

export const UserRowSchema = z.object({
  deleted_at: z.date().nullable(),
  email: z.string(),
  excluded_triggers: z.string().nullable(),
  feature_flags: z.record(z.string(), z.boolean()),
  forenames: z.string().nullable(),
  groups: z.array(z.enum(UserGroup)),
  id: z.number(),
  jwt_id: z.string().nullable(),
  surname: z.string().nullable(),
  username: z.string(),
  visible_courts: z.string().nullable(),
  visible_forces: z.string().nullable()
})

export const UserMinimalRowSchema = UserRowSchema.pick({
  deleted_at: true,
  groups: true,
  id: true,
  username: true,
  visible_courts: true,
  visible_forces: true
})

export const UserSchema = z.object({
  deletedAt: z.date().nullable(),
  email: z.string(),
  excludedTriggers: z.array(z.string()).min(0),
  featureFlags: z.record(z.string(), z.boolean()),
  forenames: z.string().nullable(),
  groups: z.array(z.enum(UserGroup)),
  id: z.number(),
  jwtId: z.string().nullable(),
  surname: z.string().nullable(),
  username: z.string(),
  visibleCourts: z.array(z.string()).min(0),
  visibleForces: z.array(z.string()).min(0)
})

export const UserMinimalSchema = UserSchema.pick({
  deletedAt: true,
  username: true,
  forenames: true,
  id: true,
  surname: true
}).loose()

export const UserDtoSchema = z.object({
  deleted: z.boolean(),
  email: z.string(),
  excludedTriggers: z.string().optional(),
  featureFlags: z.object({}).catchall(z.boolean()),
  forenames: z.string().nullable(),
  fullname: z.string().optional(),
  groups: z.array(z.enum(UserGroup)),
  hasAccessTo: z.object({}).catchall(z.boolean()),
  surname: z.string().nullable(),
  username: z.string(),
  visibleCourts: z.string().optional(),
  visibleForces: z.array(z.string()).nullable()
})

export const UserListSchema = z.object({
  users: z.array(UserDtoSchema)
})

export const UserLookupDtoSchema = z.object({
  fullname: z.string().optional(),
  id: z.number()
})

export const UserLookupListSchema = z.object({
  users: z.array(UserLookupDtoSchema)
})

export type User = z.infer<typeof UserSchema>
export type UserDto = z.infer<typeof UserDtoSchema>
export type UserList = z.infer<typeof UserListSchema>
export type UserLookupDto = z.infer<typeof UserLookupDtoSchema>
export type UserLookupList = z.infer<typeof UserLookupListSchema>
export type UserMinimal = Pick<User, "deletedAt" | "groups" | "id" | "username" | "visibleCourts" | "visibleForces">
export type UserMinimalRow = z.infer<typeof UserMinimalRowSchema>
export type UserRow = z.infer<typeof UserRowSchema>
