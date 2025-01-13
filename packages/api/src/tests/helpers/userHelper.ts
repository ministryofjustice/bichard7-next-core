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

export const createUserAndJwtToken = async (
  db: End2EndPostgres,
  groups: UserGroup[] = [UserGroup.GeneralHandler]
): Promise<[string, User]> => {
  const jwtId = randomUUID()
  const user = await db.createTestUser({
    email: "user1@example.com",
    forenames: "Forename1",
    groups,
    id: 1,
    jwt_id: jwtId,
    surname: "Surname1",
    username: "User1",
    visible_forces: "001"
  } satisfies User)

  return [generateTestJwtToken(user, jwtId), user]
}

export const createUsers = async (
  db: End2EndPostgres,
  numberOfUsers: number,
  groups: UserGroup[] = [UserGroup.GeneralHandler]
): Promise<User[]> => {
  const offset = 2

  const users: User[] = await Promise.all(
    Array(numberOfUsers)
      .fill(null)
      .map(async (_, i) => {
        const num = i + offset

        const user = (await db.createTestUser({
          email: `user${num}@example.com`,
          forenames: `Forename${num}`,
          groups,
          id: num,
          jwt_id: null,
          surname: `Surname${num}`,
          username: `User${num}`,
          visible_forces: "001"
        })) satisfies User

        return user
      })
  )

  return users
}
