import type { User } from "@moj-bichard7/common/types/User"

import FakeDataStore from "../../services/gateways/database/FakeDatabase"
import { generateTestJwtToken } from "../../tests/helpers/jwtHelper"
import verifyJwt from "./verifyJwt"

const validJwtId = "c058a1bf-ce6a-45d9-8e84-9729aeac5246"

describe("verifyJwt", () => {
  const fakeDataStore = new FakeDataStore()

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it("will return an error if the username does not exists in the db", async () => {
    const jwtString = generateTestJwtToken({ username: "UserNotFound" })
    const spy = jest.spyOn(fakeDataStore, "fetchUserByUsername")
    spy.mockRejectedValue(new Error("User UserNotFound does not exist"))

    await expect(verifyJwt(fakeDataStore, jwtString)).rejects.toThrow("User UserNotFound does not exist")
  })

  it("will return a User if the username exists in the db and the JWT ID matches", async () => {
    const user = { jwt_id: validJwtId, username: "UserFound" }
    const jwtString = generateTestJwtToken(user, validJwtId)
    const spy = jest.spyOn(fakeDataStore, "fetchUserByUsername")

    spy.mockImplementation((username: string): Promise<User> => {
      const fakeUser: User = {
        email: `${username}@example.com`,
        excluded_triggers: null,
        feature_flags: {},
        forenames: "Forename",
        groups: [],
        id: 1,
        jwt_id: validJwtId,
        surname: "Surname",
        username: user.username,
        visible_courts: null,
        visible_forces: "001"
      }
      return Promise.resolve(fakeUser)
    })

    const result: undefined | User = await verifyJwt(fakeDataStore, jwtString)

    if (result === undefined) {
      throw new Error("Test is wrong")
    }

    expect(result.username).toBe(user.username)
    expect(result.jwt_id).toBe(user.jwt_id)
    expect(result.jwt_id).toBe(validJwtId)
  })

  it("will throw an error if the JWT is not valid", async () => {
    await expect(verifyJwt(fakeDataStore, "NotARealJWT")).rejects.toThrow("jwt malformed")
  })

  it("will return undefined if the username exists in the db and the JWT ID doesn't match", async () => {
    const user = { jwt_id: null, username: "UserFound" }
    const jwtString = generateTestJwtToken(user, validJwtId)
    const spy = jest.spyOn(fakeDataStore, "fetchUserByUsername")

    spy.mockImplementation((username: string): Promise<User> => {
      const fakeUser: User = {
        email: `${username}@example.com`,
        excluded_triggers: null,
        feature_flags: {},
        forenames: "Forename",
        groups: [],
        id: 1,
        jwt_id: null,
        surname: "Surname",
        username: user.username,
        visible_courts: null,
        visible_forces: "001"
      }
      return Promise.resolve(fakeUser)
    })

    const result: undefined | User = await verifyJwt(fakeDataStore, jwtString)

    expect(result).toBeUndefined()
  })
})
