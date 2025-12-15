import type { InsertResult } from "typeorm"
import users from "../../cypress/fixtures/users"
import User from "../../src/services/entities/User"
import getDataSource from "../../src/services/getDataSource"

const TemplateUser: Partial<User> = {
  username: "Bichard01",
  visibleForces: ["01"],
  visibleCourts: [],
  excludedTriggers: [],
  forenames: "Bichard Test User",
  password: "",
  surname: "01",
  email: "bichard01@example.com",
  featureFlags: {
    test_flag: true,
    pncDetailsTabEnabled: true,
    useCourtDateReceivedDateMismatchFiltersEnabled: true,
    useTriggerAndExceptionQualityAuditingEnabled: true
  }
}

const getDummyUser = async (overrides?: Partial<User>): Promise<User> =>
  (await getDataSource()).getRepository(User).create({
    ...TemplateUser,
    ...overrides
  })

const insertUserIntoGroup = async (emailAddress: string, groupName: string): Promise<InsertResult> => {
  const dataSource = await getDataSource()

  return await dataSource.manager.query(
    `
      INSERT INTO
        br7own.users_groups(
        group_id,
        user_id
      )
      SELECT G.id, U.id FROM br7own.users AS U, br7own."groups" AS G
      WHERE
        G.id = (SELECT id FROM br7own.groups WHERE friendly_name=$1 LIMIT 1)
        AND
        U.id = (SELECT id FROM br7own.users WHERE email=$2 LIMIT 1)
      ON CONFLICT (group_id, user_id) DO NOTHING
    `,
    [groupName, emailAddress]
  )
}

const runQuery = async (query: string) => {
  const dataSource = await getDataSource()
  return dataSource.manager.query(query)
}

export const insertUser = async (user: User, userGroups?: string[]): Promise<InsertResult | void> => {
  const dataSource = await getDataSource()
  const userRepository = dataSource.getRepository(User)

  // Only add user to database if necessary
  const userExists = (await userRepository.findBy({ username: user.username })).length === 1

  if (userExists) {
    return
  }

  const result = await dataSource.createQueryBuilder().insert().into(User).values(user).orIgnore().execute()

  if (!userGroups?.length) {
    return result
  }

  for (const userGroup of userGroups) {
    await insertUserIntoGroup(user.email, userGroup)
  }
}

export const createUser = async (type: string): Promise<User | null> => {
  const user = users[type]

  if (!user) {
    throw new Error(`Could not find user: ${type}`)
  }

  const newUser = await getDummyUser({ ...user })
  await insertUser(newUser, newUser.groups)

  const dataSource = await getDataSource()
  const userRepository = dataSource.getRepository(User)
  return userRepository.findOneBy({ username: user.username })
}

const insertUsers = async (userData: User | User[], userGroups?: string[]): Promise<null> => {
  const userArray: User[] = Array.isArray(userData) ? userData : [userData]

  for (const user of userArray) {
    await insertUser(user, userGroups)
  }

  return null
}

const insertUsersWithOverrides = async (userOverrides: Partial<User>[], userGroups?: string[]) => {
  const usersToInsert: User[] = []
  for (const userOverride of userOverrides) {
    usersToInsert.push(await getDummyUser({ ...userOverride }))
  }

  return await insertUsers(usersToInsert, userGroups)
}

export { getDummyUser, insertUserIntoGroup, insertUsers, insertUsersWithOverrides, runQuery }
