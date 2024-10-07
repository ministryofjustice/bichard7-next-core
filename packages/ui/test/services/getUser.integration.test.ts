import { DataSource } from "typeorm"
import { UserGroup } from "types/UserGroup"
import User from "../../src/services/entities/User"
import getDataSource from "../../src/services/getDataSource"
import getUser from "../../src/services/getUser"
import { isError } from "../../src/types/Result"
import { createUser, runQuery } from "../utils/manageUsers"

describe("getUser", () => {
  let dataSource: DataSource

  beforeAll(async () => {
    dataSource = await getDataSource()
  })

  afterAll(async () => {
    if (dataSource) {
      await dataSource.destroy()
    }
  })

  it("Should return the user when given a matching username", async () => {
    const inputUser = await createUser("GeneralHandler")
    const groups = ["B7Supervisor_grp", "B7GeneralHandler_grp"]
    const expectedGroups: UserGroup[] = [UserGroup.Supervisor, UserGroup.GeneralHandler]

    const result = await getUser(dataSource, inputUser!.username, groups)
    expect(isError(result)).toBe(false)

    const actualUser = result as User

    expect({ ...actualUser }).toStrictEqual({ ...inputUser, id: expect.any(Number), groups: expectedGroups })
  })

  it("shouldn't return the user when given different username", async () => {
    await createUser("GeneralHandler")

    const result = await getUser(dataSource, "usernameWrong")
    expect(isError(result)).toBe(false)
    expect(result).toBeNull()
  })

  it("shouldn't return the user when given an empty username", async () => {
    await createUser("GeneralHandler")

    const result = await getUser(dataSource, "")
    expect(isError(result)).toBe(false)
    expect(result).toBeNull()
  })

  it("Should parse missing feature flags correctly", async () => {
    await createUser("NoGroups")

    await runQuery(`UPDATE br7own.users SET feature_flags = '{}' WHERE username = 'NoGroups';`)

    const result = await getUser(dataSource, "NoGroups")
    expect(isError(result)).toBe(false)

    const actualUser = result as User
    expect(actualUser.featureFlags).toStrictEqual({})
  })

  it("Should fetch feature flags correctly when unescaped values are in the DB", async () => {
    await createUser("NoGroups")
    await runQuery(`UPDATE br7own.users SET feature_flags = '{"test_flag":true}' WHERE username = 'NoGroups';`)

    const result = await getUser(dataSource, "NoGroups")
    expect(isError(result)).toBe(false)

    const actualUser = result as User
    expect(actualUser.featureFlags).toStrictEqual({ test_flag: true })
  })
})
