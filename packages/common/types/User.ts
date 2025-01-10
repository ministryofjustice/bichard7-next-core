import { z } from "zod"

import { UserGroup } from "./UserGroup"

export const UserSchema = z.object({
  email: z.string(),
  forenames: z.string().nullable(),
  groups: z.array(z.nativeEnum(UserGroup)),
  id: z.number(),
  jwt_id: z.string().nullable(),
  surname: z.string().nullable(),
  username: z.string(),
  visible_forces: z.string().nullable()
})

export type User = z.infer<typeof UserSchema>
