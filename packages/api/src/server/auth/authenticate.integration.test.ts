import type { FastifyInstance } from "fastify"

import { BAD_GATEWAY, OK, UNAUTHORIZED } from "http-status"

import build from "../../app"
import { VersionedEndpoints } from "../../endpoints/versionedEndpoints"
import FakeDataStore from "../../services/gateways/dataStoreGateways/fakeDataStore"
import { generateJwtForStaticUser } from "../../tests/helpers/userHelper"

const defaults = {
  headers: {
    Authorization: "Bearer "
  },
  url: VersionedEndpoints.V1Me
}

describe("authenticate", () => {
  const db = new FakeDataStore()
  let app: FastifyInstance

  beforeAll(async () => {
    app = await build({ db })
    await app.ready()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  afterAll(async () => {
    await app.close()
  })

  it("will return with no headers 401 - Unauthorized", async () => {
    const response = await app.inject({
      ...defaults,
      headers: {}
    })

    expect(response.statusCode).toBe(UNAUTHORIZED)
  })

  it("returns 401 if jwt doesn't start with Bearer", async () => {
    const { statusCode } = await app.inject({
      ...defaults,
      headers: {
        ...defaults.headers,
        Authorization: "Not Bearer "
      }
    })

    expect(statusCode).toBe(UNAUTHORIZED)
  })

  it("returns 401 if jwt can't be parsed", async () => {
    const invalidJwt = "abc123"

    const { statusCode } = await app.inject({
      ...defaults,
      headers: {
        ...defaults.headers,
        Authorization: `Bearer ${invalidJwt}`
      }
    })

    expect(statusCode).toBe(UNAUTHORIZED)
  })

  it("returns 401 if the verification result is false", async () => {
    const { statusCode } = await app.inject({
      ...defaults
    })

    expect(statusCode).toBe(UNAUTHORIZED)
  })

  it("will return 401 - Unauthorized with a missing user", async () => {
    const spy = jest.spyOn(db, "fetchUserByUsername")
    spy.mockRejectedValue(new Error('User "User 1" does not exist'))

    const [encodedJwt] = generateJwtForStaticUser()

    const response = await app.inject({
      ...defaults,
      headers: {
        ...defaults.headers,
        authorization: `Bearer ${encodedJwt}`
      }
    })

    expect(response.statusCode).toBe(UNAUTHORIZED)
  })

  it("returns 200 if the verification result is a User", async () => {
    const [encodedJwt, user] = generateJwtForStaticUser()
    const spy = jest.spyOn(db, "fetchUserByUsername")
    spy.mockResolvedValue(user)

    const { statusCode } = await app.inject({
      ...defaults,
      headers: {
        ...defaults.headers,
        authorization: `Bearer ${encodedJwt}`
      }
    })

    expect(statusCode).toBe(OK)
  })

  it("fails if db failed to respond", async () => {
    const [encodedJwt] = generateJwtForStaticUser()
    const error = new Error("AggregateError")
    error.name = "AggregateError"
    error.stack = "Something Sql or pOstGreS"
    jest.spyOn(db, "fetchUserByUsername").mockRejectedValue(error)

    const { statusCode } = await app.inject({
      ...defaults,
      headers: {
        ...defaults.headers,
        authorization: `Bearer ${encodedJwt}`
      }
    })

    expect(statusCode).toBe(BAD_GATEWAY)
  })
})
