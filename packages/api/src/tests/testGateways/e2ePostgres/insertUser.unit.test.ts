import type { User } from "@moj-bichard7/common/types/User"
import type postgres from "postgres"

import { randomUUID } from "crypto"

import insertUser from "./insertUser"

describe("insertUser", () => {
  it("user needs to have all required attributes: email", async () => {
    const sql = jest.fn(() => []) as unknown as postgres.Sql
    const user: Partial<User> = { username: "User1" }

    await expect(insertUser(sql, user)).rejects.toThrow("Missing required attributes")
  })

  it("user needs to have all required attributes: username", async () => {
    const sql = jest.fn(() => []) as unknown as postgres.Sql
    const user: Partial<User> = { email: "user1@example.com" }

    await expect(insertUser(sql, user)).rejects.toThrow("Missing required attributes")
  })

  it("user could not be inserted", async () => {
    const sql = jest.fn(() => []) as unknown as postgres.Sql
    const user: Partial<User> = { email: "user1@example.com", username: "User1" }

    await expect(insertUser(sql, user)).rejects.toThrow("Could not insert User into the DB")
  })

  it("user could be inserted", async () => {
    const expectedUser = {
      email: "user1@example.com",
      id: 1,
      jwt_id: null,
      username: "User1",
      visible_forces: null
    } satisfies User
    const sql = jest.fn(() => [expectedUser]) as unknown as postgres.Sql
    const userInserted: Partial<User> = { email: "user1@example.com", username: "User1" }

    const user = await insertUser(sql, userInserted)

    expect(expectedUser).toEqual(user)
  })

  it("user could be inserted with JWT ID", async () => {
    const jwtId = randomUUID()
    const expectedUser = {
      email: "user1@example.com",
      id: 1,
      jwt_id: jwtId,
      username: "User1",
      visible_forces: null
    } satisfies User
    const sql = jest.fn(() => [expectedUser]) as unknown as postgres.Sql
    const userInserted: Partial<User> = { email: "user1@example.com", jwt_id: jwtId, username: "User1" }

    const user = await insertUser(sql, userInserted)

    expect(expectedUser).toEqual(user)
  })
})
