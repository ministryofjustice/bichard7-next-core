import { isError } from "types/Result"
import Database from "types/Database"
import isUserWithinGroup from "useCases/isUserWithinGroup"
import getUserByEmailAddress from "useCases/getUserByEmailAddress"
import getTestConnection from "../../testFixtures/getTestConnection"
import deleteFromTable from "../../testFixtures/database/deleteFromTable"
import insertIntoTable from "../../testFixtures/database/insertIntoUsersTable"
import users from "../../testFixtures/database/data/users"
import groups from "../../testFixtures/database/data/groups"
import insertIntoUserGroupsTable from "../../testFixtures/database/insertIntoUserGroupsTable"
import insertIntoGroupTable from "../../testFixtures/database/insertIntoGroupsTable"

describe("getFilteredUsers", () => {
  let connection: Database

  beforeAll(() => {
    connection = getTestConnection()
  })

  beforeAll(async () => {
    await deleteFromTable("users")
  })

  afterAll(() => {
    connection.$pool.end()
  })

  it("should determine correctly if user is within group", async () => {
    await insertIntoGroupTable(groups)
    await insertIntoTable(users)

    const user = await getUserByEmailAddress(connection, "bichard01@example.com")
    if (isError(user)) {
      expect(isError(user)).toBe(false)
      return
    }

    if (!user) {
      expect(!user).toBeTruthy()
      return
    }

    const actualError = await insertIntoUserGroupsTable(user?.emailAddress, ["B7SuperUserManager_grp"])
    expect(isError(actualError)).toBe(false)

    const result01 = await isUserWithinGroup(connection, user.id, "B7SuperUserManager")
    expect(isError(result01)).toBe(false)
    expect(result01).toBe(true)

    const result02 = await isUserWithinGroup(connection, user.id + 1, "B7SuperUserManager")
    expect(isError(result02)).toBe(false)
    expect(result02).toBe(false)

    const result03 = await isUserWithinGroup(connection, -1, "B7SuperUserManager")
    expect(isError(result03)).toBe(false)
    expect(result03).toBe(false)
  })
})
