import deleteUser from "useCases/deleteUser"
import type Database from "types/Database"
import getTestConnection from "../../testFixtures/getTestConnection"
import deleteFromTable from "../../testFixtures/database/deleteFromTable"
import insertIntoUsersTable from "../../testFixtures/database/insertIntoUsersTable"
import insertIntoGroupsTable from "../../testFixtures/database/insertIntoGroupsTable"
import insertIntoUserGroupsTable from "../../testFixtures/database/insertIntoUserGroupsTable"
import selectFromTable from "../../testFixtures/database/selectFromTable"
import users from "../../testFixtures/database/data/users"
import groups from "../../testFixtures/database/data/groups"
import fakeAuditLogger from "../fakeAuditLogger"

describe("DeleteUserUseCase", () => {
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

  it("should return deleted response when successfully deletes the user", async () => {
    await insertIntoUsersTable(users)
    await insertIntoGroupsTable(groups)
    await insertIntoUserGroupsTable(
      "bichard01@example.com",
      groups.map((g) => g.name)
    )

    const currentUser = (await selectFromTable("users", "username", "Bichard01"))[0]
    const emailAddress = "bichard02@example.com"

    const result = await deleteUser(connection, fakeAuditLogger, { emailAddress } as any, currentUser)

    expect(result).toBeDefined()

    const { isDeleted } = result
    expect(isDeleted).toBe(true)

    const actualUserList = await selectFromTable("users", "email", emailAddress)
    const actualUser = actualUserList[0]

    expect(actualUser).toBeDefined()
    expect(actualUser).not.toBeNull()
    expect(actualUser.username).toBe("Bichard02")
    expect(actualUser.deleted_at).toBeDefined()
    expect(actualUser.deleted_at).not.toBeNull()
  })

  it("should not update the deletion date when user is already deleted", async () => {
    const deletedDate = new Date()
    const mappedUsers = users.map((u) => ({
      ...u,
      deleted_at: deletedDate
    }))

    await insertIntoUsersTable(mappedUsers)
    await insertIntoGroupsTable(groups)
    await insertIntoUserGroupsTable(
      "bichard01@example.com",
      groups.map((g) => g.name)
    )

    const currentUser = (await selectFromTable("users", "username", "Bichard01"))[0]
    const emailAddress = "bichard02@example.com"

    const result = await deleteUser(connection, fakeAuditLogger, { emailAddress } as any, currentUser)

    expect(result).toBeDefined()

    const { isDeleted } = result
    expect(isDeleted).toBe(true)

    const actualUserList = await selectFromTable("users", "email", emailAddress)
    const actualUser = actualUserList[0]

    expect(actualUser).toBeDefined()
    expect(actualUser).not.toBeNull()
    expect(actualUser.username).toBe("Bichard02")
    expect(actualUser.deleted_at).toBeDefined()

    const actualDeletedAt = new Date(actualUser.deleted_at)
    expect(actualDeletedAt).toEqual(deletedDate)
  })
})
