import { isError } from "types/Result"
import { UserGroupResult } from "types/UserGroup"
import Database from "types/Database"
import getTestConnection from "../../testFixtures/getTestConnection"
import deleteFromTable from "../../testFixtures/database/deleteFromTable"
import groups from "../../testFixtures/database/data/groups"
import selectFromTable from "../../testFixtures/database/selectFromTable"
import insertIntoUsersTable from "../../testFixtures/database/insertIntoUsersTable"
import users from "../../testFixtures/database/data/users"
import insertIntoUserGroupsTable from "../../testFixtures/database/insertIntoUserGroupsTable"
import insertIntoGroupsTable from "../../testFixtures/database/insertIntoGroupsTable"
import getUserSpecificGroups from "useCases/getUserSpecificGroups"
import getUserHierarchyGroups from "useCases/getUserHierarchyGroups"

describe("getUserSpecificGroups", () => {
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

  it("should return specific groups when groups exists in the database", async () => {
    await insertIntoUsersTable(users)
    await insertIntoGroupsTable(groups)
    await insertIntoUserGroupsTable(
      "bichard01@example.com",
      groups.map((g) => g.name).filter((name) => name.includes("GeneralHandler"))
    )
    const { username } = (await selectFromTable("users", "username", "Bichard01"))[0]

    const groupsResult = (await getUserSpecificGroups(connection, username)) as UserGroupResult[]
    let selectedGroups = await selectFromTable("groups", undefined, undefined, "id")
    selectedGroups = selectedGroups.filter((g) => g.name.includes("GeneralHandler"))
    expect(selectedGroups.length).toBe(1)

    expect(isError(groupsResult)).toBe(false)
    expect(groupsResult.length).toBe(selectedGroups.length)

    for (let i = 0; i < groupsResult.length; i++) {
      expect(groupsResult[i].id).toBe(selectedGroups[i].id)
      expect(groupsResult[i].name).toBe(selectedGroups[i].name)
    }
  })

  it("should return hierarchy groups when groups exists in the database", async () => {
    await insertIntoUsersTable(users)
    await insertIntoGroupsTable(groups)
    await insertIntoUserGroupsTable(
      "bichard01@example.com",
      groups.map((g) => g.name).filter((name) => name.includes("Handler"))
    )
    const { username } = (await selectFromTable("users", "username", "Bichard01"))[0]

    const groupsResult = (await getUserHierarchyGroups(connection, username)) as UserGroupResult[]
    let selectedGroups = await selectFromTable("groups", undefined, undefined, "id")
    selectedGroups = selectedGroups.filter((g) => g.name.includes("Handler"))
    expect(selectedGroups.length).toBe(3)

    expect(isError(groupsResult)).toBe(false)
    expect(groupsResult.length).toBe(selectedGroups.length)

    for (let i = 0; i < groupsResult.length; i++) {
      expect(groupsResult[i].id).toBe(selectedGroups[i].id)
      expect(groupsResult[i].name).toBe(selectedGroups[i].name)
    }
  })
})
