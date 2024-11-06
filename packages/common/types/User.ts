import "zod-openapi/extend"

import { z } from "zod"
import { UserGroup } from "./UserGroup"

export const UserSchema = z.object({
  id: z.number(),
  username: z.string(),
  email: z.string(),
  jwt_id: z.string().nullable(),
  groups: z.array(z.nativeEnum(UserGroup)).optional(),
  visible_forces: z.string().nullable()
})

export type User = z.infer<typeof UserSchema>
