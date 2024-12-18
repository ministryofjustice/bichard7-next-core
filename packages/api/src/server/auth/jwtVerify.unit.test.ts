import type { User } from "@moj-bichard7/common/types/User"

import FakeDataStore from "../../services/gateways/dataStoreGateways/fakeDataStore"
import { generateTestJwtToken } from "../../tests/helpers/jwtHelper"
import jwtVerify from "./jwtVerify"

const validJwtId = "c058a1bf-ce6a-45d9-8e84-9729aeac5246"

describe("jwtVerify", () => {
  const db = new FakeDataStore()

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it("will return an error if the username does not exists in the db", async () => {
    const jwtString = generateTestJwtToken({ username: "UserNotFound" } as User)
    const spy = jest.spyOn(db, "fetchUserByUsername")
    spy.mockRejectedValue(new Error("User UserNotFound does not exist"))

    await expect(jwtVerify(db, jwtString)).rejects.toThrow("User UserNotFound does not exist")
  })

  it("will return a User if the username exists in the db and the JWT ID matches", async () => {
    const user = { jwt_id: validJwtId, username: "UserFound" } as User
    const jwtString = generateTestJwtToken(user, validJwtId)
    const spy = jest.spyOn(db, "fetchUserByUsername")

    spy.mockImplementation((username: string): Promise<User> => {
      const fakeUser = {
        email: `${username}@example.com`,
        groups: [],
        id: 1,
        jwt_id: validJwtId,
        username: user.username,
        visible_forces: ""
      } satisfies User
      return Promise.resolve(fakeUser)
    })

    const result: undefined | User = await jwtVerify(db, jwtString)

    if (result === undefined) {
      throw new Error("Test is wrong")
    }

    expect(result.username).toBe(user.username)
    expect(result.jwt_id).toBe(user.jwt_id)
    expect(result.jwt_id).toBe(validJwtId)
  })

  it("will throw an error if the JWT is not valid", async () => {
    await expect(jwtVerify(db, "NotARealJWT")).rejects.toThrow("jwt malformed")
  })

  it("will return undefined if the username exists in the db and the JWT ID doesn't match", async () => {
    const user = { jwt_id: null, username: "UserFound" } as User
    const jwtString = generateTestJwtToken(user, validJwtId)
    const spy = jest.spyOn(db, "fetchUserByUsername")

    spy.mockImplementation((username: string): Promise<User> => {
      const fakeUser = {
        email: `${username}@example.com`,
        groups: [],
        id: 1,
        jwt_id: null,
        username: user.username,
        visible_forces: ""
      } satisfies User
      return Promise.resolve(fakeUser)
    })

    const result: undefined | User = await jwtVerify(db, jwtString)

    expect(result).toBeUndefined()
  })
})
