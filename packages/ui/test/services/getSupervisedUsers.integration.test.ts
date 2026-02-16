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
    const supervisor = await getUser(dataSource, "Supervisor")

    const result = await getSupervisedUsers(dataSource, supervisor as User)

    const userList = result as User[]

    expect(userList.map((u) => u.username)).toEqual(expect.arrayContaining(["GeneralHandler"]))
  })

  it("should return supervised users with more than one visible force", async () => {
    await createUser("Supervisor")
    await createUser("userExcludedTriggersMultiForces")
    await createUser("userWithAllTriggersExcluded")
    await createUser("userWithJustWarrantsTriggersIncluded")
    const supervisor = await getUser(dataSource, "Supervisor")

    const result = await getSupervisedUsers(dataSource, supervisor as User)

    const userList = result as User[]

    expect(userList.map((u) => u.username)).toEqual(expect.arrayContaining(["Supervisor"]))
    expect(userList.map((u) => u.username)).toEqual(expect.arrayContaining(["userExcludedTriggersMultiForces"]))
    expect(userList.map((u) => u.username)).toEqual(expect.arrayContaining(["userWithAllTriggersExcluded"]))
    expect(userList.map((u) => u.username)).toEqual(expect.arrayContaining(["userWithJustWarrantsTriggersIncluded"]))
  })
})
