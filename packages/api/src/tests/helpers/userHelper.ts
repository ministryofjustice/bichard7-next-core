import type { User } from "@moj-bichard7/common/types/User"
import type { UserGroup } from "@moj-bichard7/common/types/UserGroup"
import { randomUUID } from "crypto"
import type End2EndPostgresGateway from "../testGateways/e2ePostgresGateway"
import { generateTestJwtTokenAndSplit } from "./jwtHelper"

export const generateJwtForStaticUser = (userGroups: UserGroup[] = []): [string, User] => {
  const jwtId = randomUUID()
  const user = {
    username: "User 1",
    groups: userGroups,
    jwt_id: jwtId,
    id: 1,
    visible_forces: "001",
    email: "user1@example.com"
  } satisfies User

  return [generateTestJwtTokenAndSplit(user, jwtId), user]
}

export const createUserAndJwtToken = async (gateway: End2EndPostgresGateway): Promise<[string, User]> => {
  const jwtId = randomUUID()
  const user = await gateway.createTestUser({
    username: "User1",
    groups: [],
    jwt_id: jwtId,
    id: 1,
    visible_forces: "001",
    email: "user1@example.com"
  } satisfies User)

  return [generateTestJwtTokenAndSplit(user, jwtId), user]
}
