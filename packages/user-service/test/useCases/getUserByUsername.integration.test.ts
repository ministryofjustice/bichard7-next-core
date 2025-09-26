import type Database from "types/Database"
import { isError } from "types/Result"
import type User from "types/User"
import createUser from "useCases/createUser"
import getUserByUsername from "useCases/getUserByUsername"
import groups from "../../testFixtures/database/data/groups"
import users from "../../testFixtures/database/data/users"
import deleteFromTable from "../../testFixtures/database/deleteFromTable"
import insertIntoGroupsTable from "../../testFixtures/database/insertIntoGroupsTable"
import insertIntoUserGroupsTable from "../../testFixtures/database/insertIntoUserGroupsTable"
import insertIntoUsersTable from "../../testFixtures/database/insertIntoUsersTable"
import selectFromTable from "../../testFixtures/database/selectFromTable"
import getTestConnection from "../../testFixtures/getTestConnection"

describe("getUserByUsername", () => {
  let connection: Database
  let selectedGroups: any
  let user: any

  const insertGroupAndUser = async () => {
    const currentUser = (await selectFromTable("users", "username", "Bichard01"))[0]
    selectedGroups = await selectFromTable("groups", undefined, undefined, "id")
    user = users.filter((u) => u.username === "Bichard02")[0] as any
    const createUserDetails: any = {
      username: user.username,
      forenames: user.forenames,
      emailAddress: user.email,
      endorsedBy: user.endorsed_by,
      surname: user.surname,
      orgServes: user.org_serves,
      visibleForces: "001,004,",
      visibleCourts: "B01,B41ME00",
      excludedTriggers: "TRPR0001,",
      featureFlags: { httpsRedirect: true }
    }

    selectedGroups.forEach((group: any) => {
      createUserDetails[group.name] = "yes"
    })

    const result = await createUser(connection, { id: currentUser.id, username: "Bichard01" }, createUserDetails)
    expect(isError(result)).toBe(false)
  }

  beforeAll(() => {
    connection = getTestConnection()
  })

  beforeEach(async () => {
    await deleteFromTable("users_groups")
    await deleteFromTable("users")
    await deleteFromTable("groups")
    await insertIntoUsersTable(users.filter((u) => u.username === "Bichard01"))
    await insertIntoGroupsTable(groups)
    await insertIntoUserGroupsTable(
      "bichard01@example.com",
      groups.map((g) => g.name)
    )
  })

  afterAll(() => {
    connection.$pool.end()
  })

  it("should return user when user exists in the database", async () => {
    await insertGroupAndUser()
    const userResult = await getUserByUsername(connection, "Bichard01")
    const expectedUserList = await selectFromTable("users", "email", "bichard01@example.com")
    const expectedUser = expectedUserList[0]

    expect(isError(user)).toBe(false)

    const actualUser = <User>userResult
    expect(actualUser.id).toBe(expectedUser.id)
    expect(actualUser.emailAddress).toBe(expectedUser.email)
    expect(actualUser.username).toBe(expectedUser.username)
    expect(actualUser.endorsedBy).toBe(expectedUser.endorsed_by)
    expect(actualUser.orgServes).toBe(expectedUser.org_serves)
    expect(actualUser.forenames).toBe(expectedUser.forenames)
    expect(actualUser.visibleForces).toBe(expectedUser.visible_forces)
    expect(actualUser.visibleCourts).toBe(expectedUser.visible_courts)
    expect(actualUser.excludedTriggers).toBe(expectedUser.excluded_triggers)
  })

  it("should return null when user does not exist in the database", async () => {
    await insertGroupAndUser()
    const result = await getUserByUsername(connection, "InvalidUsername")
    expect(result).toBeNull()
  })

  it("should return null when user is deleted", async () => {
    const mappedUsers = users
      .filter((u) => u.username !== "Bichard01")
      .map((u) => ({
        ...u,
        deleted_at: new Date()
      }))

    await insertIntoUsersTable(mappedUsers)

    const result = await getUserByUsername(connection, "incorrectusername")
    expect(result).toBeNull()
  })

  it("should return correct group", async () => {
    await insertGroupAndUser()
    const selectedUsers = await selectFromTable("users", "email", user.email)
    const selectedUserUsername = selectedUsers[0].username
    const userResult = await getUserByUsername(connection, selectedUserUsername)

    expect(isError(userResult)).toBe(false)

    const actualUser = userResult as User
    expect(actualUser.groups).toHaveLength(10)
  })
})
