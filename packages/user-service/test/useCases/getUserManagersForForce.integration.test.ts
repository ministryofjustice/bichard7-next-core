import { isError } from "types/Result"
import type Database from "types/Database"
import getTestConnection from "../../testFixtures/getTestConnection"
import deleteFromTable from "../../testFixtures/database/deleteFromTable"
import insertIntoTable from "../../testFixtures/database/insertIntoUsersTable"
import users from "../../testFixtures/database/data/users"
import manyUsers from "../../testFixtures/database/data/manyUsers"
import getUserManagersForForce from "useCases/getUserManagersForForce"
import insertIntoGroupTable from "../../testFixtures/database/insertIntoGroupsTable"
import groups from "../../testFixtures/database/data/groups"
import insertIntoUserGroupsTable from "../../testFixtures/database/insertIntoUserGroupsTable"

describe("getFilteredUsers", () => {
  let connection: Database

  beforeAll(() => {
    connection = getTestConnection()
    insertIntoGroupTable(groups)
  })

  afterAll(() => {
    connection.$pool.end()
  })

  it("should return correct users from the database with single force code", async () => {
    await deleteFromTable("users")
    await deleteFromTable("users_groups")
    await insertIntoTable(users)
    await insertIntoUserGroupsTable(
      "bichard01@example.com",
      groups.map((g) => g.name)
    )
    await insertIntoUserGroupsTable(
      "bichard02@example.com",
      groups.map((g) => g.name)
    )
    await insertIntoUserGroupsTable(
      "bichard03@example.com",
      groups.map((g) => g.name)
    )

    const result01 = await getUserManagersForForce(connection, "001")
    if (isError(result01)) {
      expect(isError(result01)).toBe(false)
      return
    }

    expect(result01).toHaveLength(2)
  })

  it("should return correct users from the database with multiple force codes", async () => {
    await deleteFromTable("users")
    await deleteFromTable("users_groups")
    await insertIntoTable(users)
    await insertIntoUserGroupsTable(
      "bichard01@example.com",
      groups.map((g) => g.name)
    )
    await insertIntoUserGroupsTable(
      "bichard02@example.com",
      groups.map((g) => g.name)
    )
    await insertIntoUserGroupsTable(
      "bichard03@example.com",
      groups.map((g) => g.name)
    )
    const result01 = await getUserManagersForForce(connection, "001,002,004")
    expect(isError(result01)).toBe(false)

    if (isError(result01)) {
      expect(isError(result01)).toBe(false)
      return
    }

    expect(result01).toHaveLength(2)
  })

  it("should return every user if no force is provided", async () => {
    await deleteFromTable("users")
    await deleteFromTable("users_groups")
    await insertIntoTable(users)
    await insertIntoUserGroupsTable(
      "bichard01@example.com",
      groups.map((g) => g.name)
    )
    await insertIntoUserGroupsTable(
      "bichard02@example.com",
      groups.map((g) => g.name)
    )
    await insertIntoUserGroupsTable(
      "bichard03@example.com",
      groups.map((g) => g.name)
    )
    const result01 = await getUserManagersForForce(connection, "")
    expect(isError(result01)).toBe(false)

    if (isError(result01)) {
      expect(isError(result01)).toBe(false)
      return
    }

    expect(result01).toHaveLength(0)
  })

  it("should return all users when flag is set", async () => {
    await deleteFromTable("users")
    await deleteFromTable("users_groups")
    await insertIntoTable(manyUsers)
    await insertIntoUserGroupsTable(
      "bichard01@example.com",
      groups.map((g) => g.name)
    )
    await insertIntoUserGroupsTable(
      "bichard02@example.com",
      groups.map((g) => g.name)
    )
    await insertIntoUserGroupsTable(
      "bichard03@example.com",
      groups.map((g) => g.name)
    )
    await insertIntoUserGroupsTable(
      "bichard04@example.com",
      groups.map((g) => g.name)
    )
    await insertIntoUserGroupsTable(
      "bichard05@example.com",
      groups.map((g) => g.name)
    )
    await insertIntoUserGroupsTable(
      "bichard06@example.com",
      groups.map((g) => g.name)
    )
    await insertIntoUserGroupsTable(
      "bichard07@example.com",
      groups.map((g) => g.name)
    )
    await insertIntoUserGroupsTable(
      "bichard08@example.com",
      groups.map((g) => g.name)
    )
    await insertIntoUserGroupsTable(
      "bichard09@example.com",
      groups.map((g) => g.name)
    )
    await insertIntoUserGroupsTable(
      "bichard10@example.com",
      groups.map((g) => g.name)
    )
    await insertIntoUserGroupsTable(
      "bichard11@example.com",
      groups.map((g) => g.name)
    )
    await insertIntoUserGroupsTable(
      "bichard12@example.com",
      groups.map((g) => g.name)
    )
    let userListResult = await getUserManagersForForce(connection, "003")
    expect(isError(userListResult)).toBe(false)
    if (isError(userListResult)) {
      expect(isError(userListResult)).toBe(false)
      return
    }

    expect(userListResult).toHaveLength(3)

    userListResult = await getUserManagersForForce(connection, "003,007")
    expect(isError(userListResult)).toBe(false)

    if (isError(userListResult)) {
      expect(isError(userListResult)).toBe(false)
      return
    }

    expect(userListResult).toHaveLength(7)
  })
})
