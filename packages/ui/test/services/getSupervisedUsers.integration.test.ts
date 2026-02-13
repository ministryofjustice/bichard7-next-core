import type { DataSource } from "typeorm"
import getDataSource from "../../src/services/getDataSource"
import { createUser } from "../utils/manageUsers"
import getSupervisedUsers from "../../src/services/getSupervisedUsers"
import type User from "services/entities/User"
import getUser from "../../src/services/getUser"

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

  it("should return supervised users in same force", async () => {
    await createUser("GeneralHandler")
    await createUser("Supervisor")
    const supervisor = await getUser(dataSource, "supervisor")

    const result = await getSupervisedUsers(dataSource, supervisor as User)

    const userList = result as User[]

    expect(userList.map((u) => u.username)).toEqual(expect.arrayContaining(["generalhandler"]))
  })
})
