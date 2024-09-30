import type { User } from "@moj-bichard7/common/types/User"
import type { FastifyInstance } from "fastify"
import { OK } from "http-status"
import build from "../app"
import { generateTestJwtTokenAndSplit } from "../tests/helpers/jwtHelper"
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

  it("will return the current user with a correct JWT", async () => {
    const user = { username: "user", jwt_id: validJwtId, id: 1, groups: [] } satisfies User
    mockedFetchUserByUsername.mockResolvedValue(user)

    const encodedJwt = generateTestJwtTokenAndSplit({ username: "user" } as User, validJwtId)

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
