import { z } from "zod"

import { UserGroup } from "./UserGroup"

export const PartialUserRowSchema = z.object({
  forenames: z.string().nullable(),
  surname: z.string().nullable(),
  username: z.string(),
  visible_forces: z.string().nullable()
})

export const FullUserRowSchema = PartialUserRowSchema.and(
  z.object({
    email: z.string(),
    excluded_triggers: z.string().nullable(),
    feature_flags: z.record(z.boolean()),
    groups: z.array(z.nativeEnum(UserGroup)),
    id: z.number(),
    jwt_id: z.string().nullable(),
    visible_courts: z.string().nullable()
  })
)

export const UserPartialDtoSchema = z.object({
  forenames: z.string().nullable(),
  fullname: z.string().optional(),
  surname: z.string().nullable(),
  username: z.string(),
  visibleForces: z.string().nullable()
})

export const UserDtoSchema = UserPartialDtoSchema.and(
  z.object({
    email: z.string(),
    excludedTriggers: z.string().optional(),
    featureFlags: z.record(z.boolean()),
    groups: z.array(z.nativeEnum(UserGroup)),
    hasAccessTo: z.record(z.boolean()),
    visibleCourts: z.string().optional()
  })
)

export type FullUserRow = z.infer<typeof FullUserRowSchema>
export type PartialUserRow = z.infer<typeof PartialUserRowSchema>
export type UserDto = z.infer<typeof UserDtoSchema>
export type UserPartialDto = z.infer<typeof UserPartialDtoSchema>
