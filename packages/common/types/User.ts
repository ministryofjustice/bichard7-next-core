import { z } from "zod"
import { UserGroup } from "./UserGroup"

export const UserSchema = z.object({
  id: z.number(),
  username: z.string(),
  jwt_id: z.string(),
  groups: z.array(z.nativeEnum(UserGroup))
})

export type User = z.infer<typeof UserSchema>
