import type { User } from "@moj-bichard7/common/types/User"

import { UserGroup } from "@moj-bichard7/common/types/UserGroup"
import { randomUUID } from "crypto"

import type End2EndPostgres from "../testGateways/e2ePostgres"

import { generateTestJwtToken } from "./jwtHelper"

export const generateJwtForStaticUser = (userGroups: UserGroup[] = [UserGroup.GeneralHandler]): [string, User] => {
  const jwtId = randomUUID()
  const user: User = {
    email: "user1@example.com",
    excluded_triggers: null,
    feature_flags: {},
    forenames: "Forename",
    groups: userGroups,
    id: 1,
    jwt_id: jwtId,
    surname: "Surname",
    username: "User 1",
    visible_courts: null,
    visible_forces: "001"
  }

  return [generateTestJwtToken(user, jwtId), user]
}

export const createUsers = async (
  postgres: End2EndPostgres,
  numberOfUsers: number,
  overrides: Record<number, object> = {}
): Promise<User[]> => {
  return Promise.all(
    Array(numberOfUsers)
      .fill(null)
      .map(async (_, index) => {
        const id = index + 1 // +1 to avoid user id 0
        const user: User = await postgres.createTestUser({
          email: `user${id}@example.com`,
          excluded_triggers: "",
          forenames: `Forename${id}`,
          groups: [UserGroup.GeneralHandler],
          id,
          jwt_id: randomUUID(),
          surname: `Surname${id}`,
          username: `User${id}`,
          visible_courts: "AB",
          visible_forces: "001",
          ...overrides[id]
        })

        return user
      })
  )
}

export const createUserAndJwtToken = async (
  postgres: End2EndPostgres,
  groups: UserGroup[] = [UserGroup.GeneralHandler]
): Promise<[string, User]> => {
  const [user] = await createUsers(postgres, 1, { 1: { groups } })
  return [generateTestJwtToken(user, user.jwt_id ?? ""), user]
}

export const generateJwtForUser = async (user: User) => {
  if (!user.jwt_id) {
    throw new Error("JWT ID is not defined.")
  }

  return generateTestJwtToken(user, user.jwt_id)
}

export const minimalUser = (groups: UserGroup[] = [UserGroup.ExceptionHandler]): User => {
  return {
    groups,
    username: "user1"
  } as User
}
