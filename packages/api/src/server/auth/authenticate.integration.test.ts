import type { FastifyInstance } from "fastify"
import { OK, UNAUTHORIZED } from "http-status"
import build from "../../app"
import fetchUserByUsername from "../../useCases/fetchUserByUsername"
import jwtParser from "./jwtParser"
import jwtVerify from "./jwtVerify"

import type { JWT } from "@moj-bichard7/common/types/JWT"
import type { User } from "@moj-bichard7/common/types/User"
import { staticUserWithGeneratedJwt } from "../../tests/helpers/userHelper"

jest.mock("./jwtParser")
jest.mock("./jwtVerify")
jest.mock("../../useCases/fetchUserByUsername")

const defaults = {
  url: "/me",
  headers: {
    "X-API-Key": "password",
    Authorization: "Bearer "
  }
}

describe("authenticate", () => {
  const mockedJwtParser = jwtParser as jest.Mock
  const mockedJwtVerify = jwtVerify as jest.Mock
  const mockedFetchUserByUsername = fetchUserByUsername as jest.Mock

  let app: FastifyInstance

  beforeAll(async () => {
    app = await build()
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it("returns 401 if api key is invalid", async () => {
    const { statusCode } = await app.inject({
      ...defaults,
      headers: { "X-API-Key": "invalid api key" }
    })

    expect(statusCode).toBe(UNAUTHORIZED)
  })

  it("returns 401 if jwt doesn't start with Bearer", async () => {
    const { statusCode } = await app.inject({
      ...defaults,
      headers: {
        ...defaults.headers,
        Authorization: ""
      }
    })

    expect(statusCode).toBe(UNAUTHORIZED)
  })

  it("returns 401 if jwt can't be parsed", async () => {
    mockedJwtParser.mockRejectedValue(new Error("Parsing error"))
    const { statusCode } = await app.inject(defaults)

    expect(statusCode).toBe(UNAUTHORIZED)
  })

  it("returns 401 if jwt can't be verified", async () => {
    mockedJwtParser.mockResolvedValue({} as JWT)

    mockedJwtVerify.mockRejectedValue(new Error("Verification error"))
    const { statusCode } = await app.inject(defaults)

    expect(statusCode).toBe(UNAUTHORIZED)
  })

  it("returns 401 if the verification result is false", async () => {
    mockedJwtParser.mockResolvedValue({} as JWT)

    mockedJwtVerify.mockResolvedValue(false)
    const { statusCode } = await app.inject(defaults)

    expect(statusCode).toBe(UNAUTHORIZED)
  })

  it("returns 200 if the verification result is a User", async () => {
    mockedJwtParser.mockResolvedValue({} as JWT)
    mockedJwtVerify.mockResolvedValue({ id: 1, username: "User", jwt_id: "100-123", groups: [] } satisfies User)

    const { statusCode } = await app.inject(defaults)

    expect(statusCode).toBe(OK)
  })

  it("will return with no headers 401 - Unauthorized", async () => {
    const response = await app.inject({
      ...defaults,
      headers: {}
    })

    expect(response.statusCode).toBe(UNAUTHORIZED)
  })

  it("will return 401 - Unauthorized with just X-API-Key header", async () => {
    const response = await app.inject({
      ...defaults,
      headers: {
        "X-API-Key": "password"
      }
    })

    expect(response.statusCode).toBe(UNAUTHORIZED)
  })

  it("will return 401 - Unauthorized with just Authorization header", async () => {
    const [_, encodedJwt] = staticUserWithGeneratedJwt()

    const response = await app.inject({
      ...defaults,
      headers: {
        authorization: `Bearer ${encodedJwt}`
      }
    })

    expect(response.statusCode).toBe(UNAUTHORIZED)
  })

  it("will return 401 - Unauthorized with the Authorization header is not valid", async () => {
    mockedJwtParser.mockRestore()
    mockedJwtVerify.mockRestore()

    const response = await app.inject({
      ...defaults,
      headers: {
        ...defaults.headers,
        Authorization: "Bearer abc123"
      }
    })

    expect(response.statusCode).toBe(UNAUTHORIZED)
  })

  it("will return 401 - Unauthorized with a missing user", async () => {
    mockedJwtParser.mockRestore()
    mockedJwtVerify.mockRestore()
    mockedFetchUserByUsername.mockImplementation(() => {
      throw new Error("User user does not exist")
    })
    const [_, encodedJwt] = staticUserWithGeneratedJwt()

    const response = await app.inject({
      ...defaults,
      headers: {
        ...defaults.headers,
        authorization: `Bearer ${encodedJwt}`
      }
    })

    expect(response.statusCode).toBe(UNAUTHORIZED)
  })
})
