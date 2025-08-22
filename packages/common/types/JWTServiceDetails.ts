import type { UserGroup } from "./UserGroup"

export type JWTServiceDetails = {
  emailAddress: string
  groups: UserGroup[]
  username: string
}
