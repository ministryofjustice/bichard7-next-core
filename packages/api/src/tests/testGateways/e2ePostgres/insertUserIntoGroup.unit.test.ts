import type { User } from "@moj-bichard7/common/types/User"
import type postgres from "postgres"

import { UserGroup } from "@moj-bichard7/common/types/UserGroup"
import { randomUUID } from "crypto"

import insertUserIntoGroup from "./insertUserIntoGroup"

describe("insertUserIntoGroup", () => {
  it("insert user into a group", async () => {
    const sql = jest.fn(() => [UserGroup.TriggerHandler]) as unknown as postgres.Sql

    const user: User = {
      email: "user1@example.com",
      groups: [],
      id: 1,
      jwt_id: randomUUID(),
      username: "User1",
      visible_forces: "001"
    }

    const group = await insertUserIntoGroup(sql, user, [UserGroup.TriggerHandler])

    expect(group).toStrictEqual(["Trigger Handler"])
  })

  it("insert user into multiple groups", async () => {
    const expectedGroups = [UserGroup.TriggerHandler, UserGroup.NewUI, UserGroup.ExceptionHandler]
    const sql = jest.fn(() => [expectedGroups]) as unknown as postgres.Sql

    const user: User = {
      email: "user1@example.com",
      groups: [],
      id: 1,
      jwt_id: randomUUID(),
      username: "User1",
      visible_forces: "001"
    }

    const groups = await insertUserIntoGroup(sql, user, expectedGroups)

    expect(groups).toEqual(["Trigger Handler", "New Bichard UI", "Exception Handler"])
  })
})
