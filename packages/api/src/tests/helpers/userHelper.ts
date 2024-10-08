import type { User } from "@moj-bichard7/common/types/User"
import type { UserGroup } from "@moj-bichard7/common/types/UserGroup"
import { randomUUID } from "crypto"
import { generateTestJwtTokenAndSplit } from "tests/helpers/jwtHelper"

export const generateJwtForStaticUser = (userGroups: UserGroup[] = []): [string, User] => {
  const jwtId = randomUUID()
  const user = { username: "User 1", groups: userGroups, jwt_id: jwtId, id: 1, visible_forces: "001" } satisfies User

  return [generateTestJwtTokenAndSplit(user, jwtId), user]
}
