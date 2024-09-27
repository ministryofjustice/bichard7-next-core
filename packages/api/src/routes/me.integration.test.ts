import type { User } from "@moj-bichard7/common/types/User"
import type { FastifyInstance } from "fastify"
import { OK, UNAUTHORIZED } from "http-status"
import build from "../app"
import { generateTestJwtToken } from "../server/auth/jwtHelper"
import fetchUserByUsername from "../useCases/fetchUserByUsername"

jest.mock("../useCases/fetchUserByUsername")

const validJwtId = "c058a1bf-ce6a-45d9-8e84-9729aeac5246"

describe("/me", () => {
  const mockedFetchUserByUsername = fetchUserByUsername as jest.Mock
  let app: FastifyInstance

  beforeAll(async () => {
    app = await build()
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it("will return with no headers 401 - Unauthorized", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/me"
    })

    expect(response.statusCode).toBe(UNAUTHORIZED)
  })

  it("will return 401 - Unauthorized with just X-API-Key header", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/me",
      headers: {
        "X-API-Key": "password"
      }
    })

    expect(response.statusCode).toBe(UNAUTHORIZED)
  })

  it("will return 401 - Unauthorized with just Authorization header", async () => {
    const encodedJwt = generateTestJwtToken({ username: "user" } as User, validJwtId).split(".")[1]

    const response = await app.inject({
      method: "GET",
      url: "/me",
      headers: {
        authorization: `Bearer ${encodedJwt}`
      }
    })

    expect(response.statusCode).toBe(UNAUTHORIZED)
  })

  it("will return 401 - Unauthorized with the Authorization header is not valid", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/me",
      headers: {
        "X-API-Key": "password",
        authorization: "Bearer abc123"
      }
    })

    expect(response.statusCode).toBe(UNAUTHORIZED)
  })

  it("will return 401 - Unauthorized with a missing user", async () => {
    mockedFetchUserByUsername.mockImplementation(() => {
      throw new Error("User user does not exist")
    })
    const encodedJwt = generateTestJwtToken({ username: "user" } as User, validJwtId).split(".")[1]

    const response = await app.inject({
      method: "GET",
      url: "/me",
      headers: {
        "X-API-Key": "password",
        authorization: `Bearer ${encodedJwt}`
      }
    })

    expect(response.statusCode).toBe(UNAUTHORIZED)
  })

  it("will return the current user with a correct JWT", async () => {
    const user = { username: "user", jwt_id: validJwtId, id: 1, groups: [] } satisfies User
    mockedFetchUserByUsername.mockResolvedValue(user)

    const encodedJwt = generateTestJwtToken({ username: "user" } as User, validJwtId).split(".")[1]

    const response = await app.inject({
      method: "GET",
      url: "/me",
      headers: {
        "X-API-Key": "password",
        authorization: `Bearer ${encodedJwt}`
      }
    })

    const responseUser = {
      username: user.username,
      groups: user.groups
    }

    expect(response.statusCode).toBe(OK)
    expect(response.json()).toEqual(responseUser)
  })
})
