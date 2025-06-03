import type { User } from "@moj-bichard7/common/types/User"

import { UserGroup } from "@moj-bichard7/common/types/UserGroup"
import { randomUUID } from "crypto"

import type End2EndPostgres from "../testGateways/e2ePostgres"

import { generateTestJwtToken } from "./jwtHelper"

export const generateJwtForStaticUser = (userGroups: UserGroup[] = [UserGroup.GeneralHandler]): [string, User] => {
  const jwtId = randomUUID()
  const user: User = {
    email: "user1@example.com",
    excludedTriggers: [],
    featureFlags: {},
    forenames: "Forename",
    groups: userGroups,
    id: 1,
    jwtId,
    surname: "Surname",
    username: "User 1",
    visibleCourts: [],
    visibleForces: [1]
  }

  return [generateTestJwtToken(user, jwtId), user]
}

export const createUser = async (databaseGateway: End2EndPostgres, overrides: Partial<User> = {}): Promise<User> => {
  const id = overrides.id ?? 1
  return databaseGateway.createTestUser({
    email: `user${id}@example.com`,
    excludedTriggers: [],
    featureFlags: {},
    forenames: `Forename${id}`,
    groups: [UserGroup.GeneralHandler],
    id,
    jwtId: randomUUID(),
    surname: `Surname${id}`,
    username: `User${id}`,
    visibleCourts: ["AB"],
    visibleForces: [1],
    ...(overrides ?? {})
  })
}

export const createUsers = async (
  databaseGateway: End2EndPostgres,
  numberOfUsers: number,
  overrides: Record<number, Partial<User>> = {}
): Promise<User[]> => {
  return Promise.all(
    Array(numberOfUsers)
      .fill(null)
      .map(async (_, index) => {
        const id = index + 1 // +1 to avoid user id 0
        return databaseGateway.createTestUser({
          email: `user${id}@example.com`,
          excludedTriggers: [],
          featureFlags: {},
          forenames: `Forename${id}`,
          groups: [UserGroup.GeneralHandler],
          id,
          jwtId: randomUUID(),
          surname: `Surname${id}`,
          username: `User${id}`,
          visibleCourts: ["AB"],
          visibleForces: [1],
          ...(overrides[id] ?? {})
        })
      })
  )
}

export const createUserAndJwtToken = async (
  databaseGateway: End2EndPostgres,
  groups: UserGroup[] = [UserGroup.GeneralHandler],
  overrides: Partial<User> = {}
): Promise<[string, User]> => {
  const [user] = await createUsers(databaseGateway, 1, { 1: { groups, ...overrides } })
  return [generateTestJwtToken(user, user.jwtId ?? ""), user]
}

export const generateJwtForUser = (user: User) => {
  if (!user.jwtId) {
    throw new Error("JWT ID is not defined.")
  }

  return generateTestJwtToken(user, user.jwtId)
}

export const minimalUser = (groups: UserGroup[] = [UserGroup.ExceptionHandler]): User =>
  ({
    groups,
    username: "user1"
  }) as User
