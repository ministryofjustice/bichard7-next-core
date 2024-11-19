import type { User } from "@moj-bichard7/common/types/User"
import type postgres from "postgres"
import insertUserIntoGroup from "./insertUserIntoGroup"
import { UserGroup } from "@moj-bichard7/common/types/UserGroup"
import { randomUUID } from "crypto"

describe("insertUserIntoGroup", () => {
  it("insert user into a group", async () => {
    const sql = jest.fn(() => [UserGroup.TriggerHandler]) as unknown as postgres.Sql

    const user: User = {
      username: "User1",
      groups: [],
      jwt_id: randomUUID(),
      id: 1,
      visible_forces: "001",
      email: "user1@example.com"
    }

    const group = await insertUserIntoGroup(sql, user, [UserGroup.TriggerHandler])

    expect(group).toStrictEqual(["Trigger Handler"])
  })

  it("insert user into multiple groups", async () => {
    const expectedGroups = [UserGroup.TriggerHandler, UserGroup.NewUI, UserGroup.ExceptionHandler]
    const sql = jest.fn(() => [expectedGroups]) as unknown as postgres.Sql

    const user: User = {
      username: "User1",
      groups: [],
      jwt_id: randomUUID(),
      id: 1,
      visible_forces: "001",
      email: "user1@example.com"
    }

    const groups = await insertUserIntoGroup(sql, user, expectedGroups)

    expect(groups).toEqual(["Trigger Handler", "New Bichard UI", "Exception Handler"])
  })
})
