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
  featureFlags: { test_flag: true, exceptionsEnabled: true, offenceMatchingEnabled: true, pncDetailsTabEnabled: true }
}

const getDummyUser = async (overrides?: Partial<User>): Promise<User> =>
  (await getDataSource()).getRepository(User).create({
    ...TemplateUser,
    ...overrides
  })

const insertUserIntoGroup = async (emailAddress: string, groupName: string): Promise<InsertResult> => {
  const dataSource = await getDataSource()
  return dataSource.manager.query(
    `
    INSERT INTO 
      br7own.users_groups(
      group_id, 
      user_id
    )
    SELECT G.id, U.id FROM br7own.users AS U, br7own."groups" AS G
    WHERE
    	G.id = (SELECT id FROM br7own.groups WHERE name=$1 LIMIT 1)
    	AND
    	U.id = (SELECT id FROM br7own.users WHERE email=$2 LIMIT 1)
    	AND
    	NOT EXISTS (SELECT * FROM br7own.users_groups AS UG WHERE UG.group_id = G.id AND UG.user_id = U.id)
    `,
    [groupName, emailAddress]
  )
}

const runQuery = async (query: string) => {
  const dataSource = await getDataSource()
  return dataSource.manager.query(query)
}

// DB names have pre and postfixes
const sanitiseGroupName = (name: string) => {
  if (name.match(/(?<=B7)(.*)(?=_grp)/)) {
    return name
  }

  return `B7${name}_grp`
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

  await Promise.all(
    userGroups.map((userGroup) => {
      const group = sanitiseGroupName(userGroup)
      return insertUserIntoGroup(user.email, group)
    })
  )
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

  await Promise.all(userArray.map((u) => insertUser(u, userGroups)))
  return null
}

const insertUsersWithOverrides = async (userOverrides: Partial<User>[], userGroups?: string[]) => {
  const usersToInsert: User[] = []
  for (let i = 0; i < userOverrides.length; i++) {
    usersToInsert.push(await getDummyUser({ ...userOverrides[i] }))
  }

  return insertUsers(usersToInsert, userGroups)
}

export { getDummyUser, insertUserIntoGroup, insertUsers, insertUsersWithOverrides, runQuery }
