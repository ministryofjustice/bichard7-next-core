import type { FastifyInstance } from "fastify"
import { OK, UNAUTHORIZED } from "http-status"
import build from "../../app"
import jwtParser from "./jwtParser"
import jwtVerify from "./jwtVerify"

import type { JWT } from "@moj-bichard7/common/types/JWT"
import type { User } from "@moj-bichard7/common/types/User"

jest.mock("./jwtParser")
jest.mock("./jwtVerify")

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

  let fastify: FastifyInstance

  beforeAll(async () => {
    fastify = await build()
    await fastify.ready()
  })

  afterAll(async () => {
    await fastify.close()
  })

  it("returns 401 if api key is invalid", async () => {
    const { statusCode } = await fastify.inject({
      ...defaults,
      headers: { "X-API-Key": "invalid api key" }
    })

    expect(statusCode).toBe(UNAUTHORIZED)
  })

  it("returns 401 if jwt doesn't start with Bearer", async () => {
    const { statusCode } = await fastify.inject({
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
    const { statusCode } = await fastify.inject(defaults)

    expect(statusCode).toBe(UNAUTHORIZED)
  })

  it("returns 401 if jwt can't be verified", async () => {
    mockedJwtParser.mockResolvedValue({} as JWT)

    mockedJwtVerify.mockRejectedValue(new Error("Verification error"))
    const { statusCode } = await fastify.inject(defaults)

    expect(statusCode).toBe(UNAUTHORIZED)
  })

  it("returns 401 if the verification result is false", async () => {
    mockedJwtParser.mockResolvedValue({} as JWT)

    mockedJwtVerify.mockResolvedValue(false)
    const { statusCode } = await fastify.inject(defaults)

    expect(statusCode).toBe(UNAUTHORIZED)
  })

  it("returns 200 if the verification result is a User", async () => {
    mockedJwtParser.mockResolvedValue({} as JWT)
    mockedJwtVerify.mockResolvedValue({} as User)

    const { statusCode } = await fastify.inject(defaults)

    expect(statusCode).toBe(OK)
  })
})
