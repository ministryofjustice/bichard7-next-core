import type { User } from "@moj-bichard7/common/types/User"
import FakeDataStoreGateway from "../../services/gateways/dataStoreGateways/fakeDataStoreGateway"
import { generateTestJwtToken } from "../../tests/helpers/jwtHelper"
import jwtVerify from "./jwtVerify"

const validJwtId = "c058a1bf-ce6a-45d9-8e84-9729aeac5246"

describe("jwtVerify", () => {
  const dataSourceGateway = new FakeDataStoreGateway()

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it("will return an error if the username does not exists in the db", async () => {
    const jwtString = generateTestJwtToken({ username: "UserNotFound" } as User)
    const spy = jest.spyOn(dataSourceGateway, "fetchUserByUsername")
    spy.mockRejectedValue(new Error("User UserNotFound does not exist"))

    await expect(jwtVerify(dataSourceGateway, jwtString)).rejects.toThrow("User UserNotFound does not exist")
  })

  it("will return a User if the username exists in the db and the JWT ID matches", async () => {
    const user = { username: "UserFound", jwt_id: validJwtId } as User
    const jwtString = generateTestJwtToken(user, validJwtId)
    const spy = jest.spyOn(dataSourceGateway, "fetchUserByUsername")

    spy.mockImplementation((username: string): Promise<User> => {
      const fakeUser = {
        id: 1,
        username: user.username,
        jwt_id: validJwtId,
        groups: [],
        visible_forces: "",
        email: `${username}@example.com`
      } satisfies User
      return Promise.resolve(fakeUser)
    })

    const result: User | undefined = await jwtVerify(dataSourceGateway, jwtString)

    if (result === undefined) {
      throw new Error("Test is wrong")
    }

    expect(result.username).toBe(user.username)
    expect(result.jwt_id).toBe(user.jwt_id)
    expect(result.jwt_id).toBe(validJwtId)
  })

  it("will throw an error if the JWT is not valid", async () => {
    await expect(jwtVerify(dataSourceGateway, "NotARealJWT")).rejects.toThrow("jwt malformed")
  })

  it("will return undefined if the username exists in the db and the JWT ID doesn't match", async () => {
    const user = { username: "UserFound", jwt_id: null } as User
    const jwtString = generateTestJwtToken(user, validJwtId)
    const spy = jest.spyOn(dataSourceGateway, "fetchUserByUsername")

    spy.mockImplementation((username: string): Promise<User> => {
      const fakeUser = {
        id: 1,
        username: user.username,
        jwt_id: null,
        groups: [],
        visible_forces: "",
        email: `${username}@example.com`
      } satisfies User
      return Promise.resolve(fakeUser)
    })

    const result: User | undefined = await jwtVerify(dataSourceGateway, jwtString)

    expect(result).toBeUndefined()
  })
})
