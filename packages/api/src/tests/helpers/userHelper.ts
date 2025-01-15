import type { User } from "@moj-bichard7/common/types/User"

import { UserGroup } from "@moj-bichard7/common/types/UserGroup"
import { randomUUID } from "crypto"

import type End2EndPostgres from "../testGateways/e2ePostgres"

import { generateTestJwtToken } from "./jwtHelper"

export const generateJwtForStaticUser = (userGroups: UserGroup[] = [UserGroup.GeneralHandler]): [string, User] => {
  const jwtId = randomUUID()
  const user = {
    email: "user1@example.com",
    forenames: "Forename",
    groups: userGroups,
    id: 1,
    jwt_id: jwtId,
    surname: "Surname",
    username: "User 1",
    visible_forces: "001"
  } satisfies User

  return [generateTestJwtToken(user, jwtId), user]
}

export const createUsers = async (
  db: End2EndPostgres,
  numberOfUsers: number,
  groups: UserGroup[] = [UserGroup.GeneralHandler]
): Promise<User[]> => {
  return Promise.all(
    Array(numberOfUsers)
      .fill(null)
      .map(async (_, i) => {
        const id = i + 1 // +1 to avoid user id 0
        const user = (await db.createTestUser({
          email: `user${id}@example.com`,
          forenames: `Forename${id}`,
          groups,
          id,
          jwt_id: randomUUID(),
          surname: `Surname${id}`,
          username: `User${id}`,
          visible_forces: "001"
        })) satisfies User

        return user
      })
  )
}

export const createUserAndJwtToken = async (
  db: End2EndPostgres,
  groups: UserGroup[] = [UserGroup.GeneralHandler]
): Promise<[string, User]> => {
  const [user] = await createUsers(db, 1, groups)
  return [generateTestJwtToken(user, user.jwt_id ?? ""), user]
}

export const generateJwtForUser = async (user: User) => {
  if (!user.jwt_id) {
    throw new Error("JWT ID is not defined.")
  }

  return generateTestJwtToken(user, user.jwt_id)
}
