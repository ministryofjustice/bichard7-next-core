import type { JWT } from "@moj-bichard7/common/types/JWT"
import type { User } from "@moj-bichard7/common/types/User"
import fetchUserByUsername from "../../useCases/fetchUserByUsername"
import jwtVerify from "./jwtVerify"

jest.mock("../../useCases/fetchUserByUsername")

const validExpiryDate = (): number => {
  const date = new Date()
  return Number((date.setDate(date.getDate() + 7) / 1000).toFixed())
}

const validJwtId = "c058a1bf-ce6a-45d9-8e84-9729aeac5246"

const validJwt = {
  username: "user",
  exclusionList: [],
  inclusionList: [],
  emailAddress: "user@example.com",
  groups: [],
  id: validJwtId,
  iat: 1726045193,
  exp: validExpiryDate(),
  iss: ""
} satisfies JWT

const notMatchUsernameValidJwt = {
  username: "user 2",
  exclusionList: [],
  inclusionList: [],
  emailAddress: "user@example.com",
  groups: [],
  id: validJwtId,
  iat: 1726045193,
  exp: validExpiryDate(),
  iss: ""
} satisfies JWT

const expiredJwt = {
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
  const mockedFetchUserByUsername = fetchUserByUsername as jest.Mock

  it("will return a false if the JWT is undefined", async () => {
    const result = await jwtVerify()

    expect(result).toBe(false)
  })

  it("will return a false if the JWT has expired", async () => {
    const result = await jwtVerify(expiredJwt)

    expect(result).toBe(false)
  })

  it("will return an error if the username does not exists in the db", async () => {
    mockedFetchUserByUsername.mockImplementation(() => {
      throw new Error("User user does not exist")
    })

    await expect(jwtVerify(notMatchUsernameValidJwt)).rejects.toThrow("User user does not exist")
  })

  it("will return a false if the username exists in the db and the JWT ID does not match", async () => {
    const user = { username: "user", jwt_id: "123" } as User
    mockedFetchUserByUsername.mockResolvedValue(user)

    const result = await jwtVerify(validJwt)

    expect(result).toBe(false)
  })

  it("will return a false if the username exists in the db and the JWT ID does not exist on the user", async () => {
    const user = { username: "user", jwt_id: null } as User
    mockedFetchUserByUsername.mockResolvedValue(user)

    const result = await jwtVerify(validJwt)

    expect(result).toBe(false)
  })

  it("will return a User if the username exists in the db and the JWT ID matches", async () => {
    const user = { username: "user", jwt_id: validJwtId } as User
    mockedFetchUserByUsername.mockResolvedValue(user)

    const result = await jwtVerify(validJwt)

    expect(result).toBe(user)
  })
})
