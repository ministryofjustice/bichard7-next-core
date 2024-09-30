import { z } from "zod"
import { UserGroup } from "./UserGroup"

export const UserSchema = z.object({
  id: z.number(),
  username: z.string(),
  jwt_id: z.string().nullable(),
  groups: z.array(z.nativeEnum(UserGroup)),
  visible_forces: z.string()
})

export type User = z.infer<typeof UserSchema>
