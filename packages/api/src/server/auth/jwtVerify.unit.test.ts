import type { JWT } from "@moj-bichard7/common/types/JWT"
import type { User } from "@moj-bichard7/common/types/User"
import jwtVerify from "server/auth/jwtVerify"
import FakeGateway from "services/gateways/fakeGateway"

const validJwtId = "c058a1bf-ce6a-45d9-8e84-9729aeac5246"

const jwt = {
  username: "user",
  exclusionList: [],
  inclusionList: [],
  emailAddress: "user@example.com",
  groups: [],
  id: validJwtId,
  iat: 1726045193,
  exp: 1726045193,
  iss: ""
} satisfies JWT

describe("jwtVerify", () => {
  const gateway = new FakeGateway()

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it("will return an error if the username does not exists in the db", async () => {
    const spy = jest.spyOn(gateway, "fetchUserByUsername")
    spy.mockRejectedValue(new Error("User user does not exist"))

    await expect(jwtVerify(gateway, jwt)).rejects.toThrow("User user does not exist")
  })

  it("will return a User if the username exists in the db and the JWT ID matches", async () => {
    const user = { username: "user", jwt_id: validJwtId } as User
    const spy = jest.spyOn(gateway, "fetchUserByUsername")

    spy.mockImplementation((username: string): Promise<User> => {
      const user = { id: 1, username, jwt_id: validJwtId, groups: [], visible_forces: "" } satisfies User
      return Promise.resolve(user)
    })

    const result: User | undefined = await jwtVerify(gateway, jwt)

    if (result === undefined) {
      throw new Error("Test is wrong")
    }

    expect(result.username).toBe(user.username)
    expect(result.jwt_id).toBe(user.jwt_id)
  })
})
