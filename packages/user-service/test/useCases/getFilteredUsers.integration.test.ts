import type User from "types/User"
import { isError } from "types/Result"
import getFilteredUsers from "useCases/getFilteredUsers"
import config from "lib/config"
import type Database from "types/Database"
import getTestConnection from "../../testFixtures/getTestConnection"
import deleteFromTable from "../../testFixtures/database/deleteFromTable"
import insertIntoTable from "../../testFixtures/database/insertIntoUsersTable"
import selectFromTable from "../../testFixtures/database/selectFromTable"
import users from "../../testFixtures/database/data/users"
import manyUsers from "../../testFixtures/database/data/manyUsers"

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

  it("should return correct users from the database", async () => {
    await insertIntoTable(users)
    const result01 = await getFilteredUsers(connection, "", "")
    expect(isError(result01)).toBe(false)

    const user01List = await selectFromTable("users", "email", "bichard01@example.com")
    const user01 = user01List[0]

    const result02 = await getFilteredUsers(connection, "Bichard01", "001")
    expect(isError(result02)).toBe(false)
    expect(result02.result).toHaveLength(1)
    const actualUser01 = <User>result02.result[0]

    expect(actualUser01.id).toBe(user01.id)

    const user02List = await selectFromTable("users", "email", "bichard02@example.com")
    const user02 = user02List[0]

    const result03 = await getFilteredUsers(connection, "bichard02@example.com", "001")
    expect(isError(result03)).toBe(false)
    expect(result03.result).toHaveLength(1)
    const actualUser02 = <User>result03.result[0]
    expect(actualUser02.id).toBe(user02.id)

    const user03List = await selectFromTable("users", "email", "bichard03@example.com")
    const user03 = user03List[0]

    const result04 = await getFilteredUsers(connection, "Surname 03", "014")
    expect(isError(result04)).toBe(false)
    expect(result04.result).toHaveLength(1)
    const actualUser03 = <User>result04.result[0]
    expect(actualUser03.id).toBe(user03.id)
  })

  it("should not return items that were previously deleted", async () => {
    const filterResult = await getFilteredUsers(connection, "Filter2Surname", "")
    expect(isError(filterResult)).toBe(false)
    expect(filterResult.result).toHaveLength(0)
  })

  it("should return users belonging to the appropriate forces", async () => {
    await deleteFromTable("users")
    await insertIntoTable(manyUsers)
    let userListResult = await getFilteredUsers(connection, "", "003")
    expect(isError(userListResult)).toBe(false)
    expect(userListResult.totalElements).toBe("3") // total number of users that match the filter

    userListResult = await getFilteredUsers(connection, "", "003,007")
    expect(isError(userListResult)).toBe(false)
    expect(userListResult.totalElements).toBe("7") // total number of users that match the filter

    userListResult = await getFilteredUsers(connection, "", "007")
    expect(isError(userListResult)).toBe(false)
    expect(userListResult.totalElements).toBe("5") // total number of users that match the filter
  })

  it("should return all users when flag is set", async () => {
    await deleteFromTable("users")
    await insertIntoTable(manyUsers)
    let userListResult = await getFilteredUsers(connection, "", "003", true)
    expect(isError(userListResult)).toBe(false)
    expect(userListResult.totalElements).toBe("13") // total number of users that match the filter

    userListResult = await getFilteredUsers(connection, "", "003,007", true)
    expect(isError(userListResult)).toBe(false)
    expect(userListResult.totalElements).toBe("13") // total number of users that match the filter

    userListResult = await getFilteredUsers(connection, "", "007", true)
    expect(isError(userListResult)).toBe(false)
    expect(userListResult.totalElements).toBe("13") // total number of users that match the filter
  })

  it("should return a paginated style result", async () => {
    await deleteFromTable("users")
    await insertIntoTable(manyUsers)
    const fullListResult = await getFilteredUsers(connection, "", "001")
    expect(isError(fullListResult)).toBe(false)
    expect(fullListResult.totalElements).toBe("12") // total number of users that match the filter
    expect(fullListResult.result).toHaveLength(config.maxUsersPerPage) // total number of users returned for paginated view

    const getSecondPageResult = await getFilteredUsers(connection, "", "001", false, 1)
    expect(isError(getSecondPageResult)).toBe(false)
    expect(getSecondPageResult.totalElements).toBe("12") // total number of users that match the filter
    expect(getSecondPageResult.result).toHaveLength(12 - config.maxUsersPerPage) // total number of users returned for paginated view

    const getFilteredResult = await getFilteredUsers(connection, "bichard0", "001")
    expect(isError(getFilteredResult)).toBe(false)
    expect(getFilteredResult.totalElements).toBe("9") // total number of users that match the filter
    expect(getFilteredResult.result).toHaveLength(9) // total number of users returned for paginated view
  })

  it("should return correct results for user without visible_forces", async () => {
    await deleteFromTable("users")
    await insertIntoTable(users)
    const fullListResult = await getFilteredUsers(connection, "", "", true)
    expect(isError(fullListResult)).toBe(false)
    expect(fullListResult.totalElements).toBe("5") // total number of users that match the filter
  })
})
