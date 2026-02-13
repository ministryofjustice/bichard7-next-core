import type { DataSource } from "typeorm"
import getDataSource from "../../src/services/getDataSource"
import { createUser } from "../utils/manageUsers"
import getSupervisedUsers from "../../src/services/getSupervisedUsers"
import getUser from "../../src/services/getUser"
import { isError } from "types/Result"
import type User from "services/entities/User"

describe("getSupervisedUsers", () => {
  let dataSource: DataSource

  beforeAll(async () => {
    dataSource = await getDataSource()
  })

  afterAll(async () => {
    if (dataSource) {
      await dataSource.destroy()
    }
  })

  it("should return no users if user is not a supervisor", async () => {
    await createUser("GeneralHandler")

    // Using lower case username due to insertUser case requirements
    const inputUser = await getUser(dataSource, "generalhandler")
    expect(isError(inputUser)).toBe(false)
    expect(inputUser).not.toBeNull()

    const result = await getSupervisedUsers(dataSource, (inputUser as User).username)

    expect(result).toEqual([])
  })
})
