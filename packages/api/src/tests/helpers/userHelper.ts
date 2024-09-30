import type { User } from "@moj-bichard7/common/types/User"
import type { UserGroup } from "@moj-bichard7/common/types/UserGroup"
import { randomUUID } from "crypto"
import { generateTestJwtTokenAndSplit } from "./jwtHelper"

export const staticUserWithGeneratedJwt = (userGroups: UserGroup[] = []): [User, string] => {
  const jwtId = randomUUID()
  const user = { username: "User 1", groups: userGroups, jwt_id: jwtId, id: 1 } satisfies User

  return [user, generateTestJwtTokenAndSplit(user, jwtId)]
}
