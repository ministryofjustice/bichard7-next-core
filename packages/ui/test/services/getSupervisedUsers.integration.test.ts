import type { DataSource } from "typeorm"
import getDataSource from "../../src/services/getDataSource"
import { createUser } from "../utils/manageUsers"

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
    const inputUser = await createUser("GeneralHandler")

    const result = await getSupervisedUsers(dataSource, inputUser!.username)

    expect(result).toEqual([])
  })
})
