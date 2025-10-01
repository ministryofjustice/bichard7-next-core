import type User from "types/User"
import { isError } from "types/Result"
import getUserById from "useCases/getUserById"
import createUser from "useCases/createUser"
import type Database from "types/Database"
import getTestConnection from "../../testFixtures/getTestConnection"
import deleteFromTable from "../../testFixtures/database/deleteFromTable"
import insertIntoUsersTable from "../../testFixtures/database/insertIntoUsersTable"
import insertIntoGroupsTable from "../../testFixtures/database/insertIntoGroupsTable"
import users from "../../testFixtures/database/data/users"
import groups from "../../testFixtures/database/data/groups"
import selectFromTable from "../../testFixtures/database/selectFromTable"
import insertIntoUserGroupsTable from "../../testFixtures/database/insertIntoUserGroupsTable"

describe("getUserById", () => {
  let connection: Database

  beforeAll(() => {
    connection = getTestConnection()
  })

  beforeEach(async () => {
    await deleteFromTable("users_groups")
    await deleteFromTable("users")
    await deleteFromTable("groups")
  })

  afterAll(() => {
    connection.$pool.end()
  })

  it("should return user when user exists in the database", async () => {
    await insertIntoUsersTable(users)
    await insertIntoGroupsTable(groups)
    const selectedGroups = await selectFromTable("groups", undefined, undefined, "name")
    const selectedGroup = selectedGroups[0]
    await insertIntoUserGroupsTable("bichard01@example.com", [selectedGroup.name])
    const currentUserId = (await selectFromTable("users", "username", "Bichard01"))[0].id
    const user = users[0]
    ;(user as any).groupId = selectedGroup.id

    const createUserDetails = {
      username: user.username,
      forenames: user.forenames,
      emailAddress: user.email,
      endorsedBy: user.endorsed_by,
      surname: user.surname,
      orgServes: user.org_serves,
      groupId: selectedGroup.id,
      visibleForces: "001,004,",
      visibleCourts: "B01,B41ME00",
      excludedTriggers: "TRPR0001,"
    }

    await createUser(connection, currentUserId, createUserDetails)

    const selectedUserList = await selectFromTable("users", "email", "bichard01@example.com")
    const selectedUser = selectedUserList[0]
    const userResult = await getUserById(connection, selectedUser.id)

    expect(isError(userResult)).toBe(false)

    const actualUser = <User>userResult
    expect(actualUser.id).toBe(selectedUser.id)
    expect(actualUser.emailAddress).toBe(selectedUser.email)
    expect(actualUser.username).toBe(selectedUser.username)
    expect(actualUser.endorsedBy).toBe(selectedUser.endorsed_by)
    expect(actualUser.orgServes).toBe(selectedUser.org_serves)
    expect(actualUser.forenames).toBe(selectedUser.forenames)
    expect(actualUser.visibleForces).toBe(user.visible_forces)
    expect(actualUser.visibleCourts).toBe(user.visible_courts)
    expect(actualUser.excludedTriggers).toBe(user.excluded_triggers)
  })

  it("should return error when user does not exist in the database", async () => {
    const result = await getUserById(connection, 0)
    expect((result as Error).message).toBe("No data returned from the query.")
  })

  it("should return error when user is deleted", async () => {
    const mappedUsers = users.map((u) => ({
      ...u,
      deleted_at: new Date()
    }))

    await insertIntoUsersTable(mappedUsers)
    const usersList = await selectFromTable("users", "email", "bichard01@example.com")
    const user = usersList[0]
    const result = await getUserById(connection, user.id)
    expect((result as Error).message).toBe("No data returned from the query.")
  })

  it("should return the correct group for the user", async () => {
    await insertIntoUsersTable(users.filter((u) => u.username === "Bichard01"))
    await insertIntoGroupsTable(groups)
    await insertIntoUserGroupsTable(
      "bichard01@example.com",
      groups.map((g) => g.name)
    )
    const currentUser = (await selectFromTable("users", "username", "Bichard01"))[0]
    const selectedGroups = await selectFromTable("groups", undefined, undefined, "name")
    const selectedGroup = selectedGroups[0]
    const user = users.filter((u) => u.username === "Bichard02")[0]

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
      featureFlags: user.feature_flags
    }
    createUserDetails[selectedGroup.name] = "yes"
    await createUser(connection, currentUser, createUserDetails)
    const selectedUsers = await selectFromTable("users", "email", user.email)
    const selectedUserId = selectedUsers[0].id
    const userResult = await getUserById(connection, selectedUserId)

    expect(isError(userResult)).toBe(false)

    const actualUser = userResult as Partial<User>

    if (actualUser.groups) {
      expect(actualUser.groups[0].id).toBe(selectedGroup.id)
    } else {
      expect(actualUser.groups).toBeDefined()
    }
  })
})
