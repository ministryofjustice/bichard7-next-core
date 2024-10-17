import type { User } from "@moj-bichard7/common/types/User"
import { randomUUID } from "crypto"
import type postgres from "postgres"
import insertUser from "./insertUser"

describe("insertUser", () => {
  it("user needs to have all required attributes: email", async () => {
    const sql = jest.fn(() => []) as unknown as postgres.Sql
    const user: Partial<User> = { username: "User1" }
    let error: Error | undefined

    try {
      await insertUser(sql, user)
    } catch (err) {
      error = err as Error
    }

    expect(error).toBeDefined()
    expect(error?.message).toBe("Missing required attributes")
  })

  it("user needs to have all required attributes: username", async () => {
    const sql = jest.fn(() => []) as unknown as postgres.Sql
    const user: Partial<User> = { email: "user1@example.com" }
    let error: Error | undefined

    try {
      await insertUser(sql, user)
    } catch (err) {
      error = err as Error
    }

    expect(error).toBeDefined()
    expect(error?.message).toBe("Missing required attributes")
  })

  it("user could not be inserted", async () => {
    const sql = jest.fn(() => []) as unknown as postgres.Sql
    const user: Partial<User> = { username: "User1", email: "user1@example.com" }
    let error: Error | undefined

    try {
      await insertUser(sql, user)
    } catch (err) {
      error = err as Error
    }

    expect(error).toBeDefined()
    expect(error?.message).toBe("Could not insert User into the DB")
  })

  it("user could be inserted", async () => {
    const expectedUser = {
      id: 1,
      username: "User1",
      email: "user1@example.com",
      jwt_id: null,
      visible_forces: null
    } satisfies User
    const sql = jest.fn(() => [expectedUser]) as unknown as postgres.Sql
    const userInserted: Partial<User> = { username: "User1", email: "user1@example.com" }

    const user = await insertUser(sql, userInserted)

    expect(expectedUser).toEqual(user)
  })

  it("user could be inserted with JWT ID", async () => {
    const jwtId = randomUUID()
    const expectedUser = {
      id: 1,
      username: "User1",
      email: "user1@example.com",
      jwt_id: jwtId,
      visible_forces: null
    } satisfies User
    const sql = jest.fn(() => [expectedUser]) as unknown as postgres.Sql
    const userInserted: Partial<User> = { username: "User1", email: "user1@example.com", jwt_id: jwtId }

    const user = await insertUser(sql, userInserted)

    expect(expectedUser).toEqual(user)
  })
})
