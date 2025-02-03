import type { FastifyInstance } from "fastify"

import { BAD_GATEWAY, OK, UNAUTHORIZED } from "http-status"

import build from "../../app"
import { V1 } from "../../endpoints/versionedEndpoints"
import FakeDataStore from "../../services/gateways/dataStoreGateways/fakeDataStore"
import AuditLogDynamoGateway from "../../services/gateways/dynamo/AuditLogDynamoGateway/AuditLogDynamoGateway"
import createAuditLogDynamoDbConfig from "../../services/gateways/dynamo/createAuditLogDynamoDbConfig"
import { generateJwtForStaticUser } from "../../tests/helpers/userHelper"

const defaults = {
  headers: {
    Authorization: "Bearer "
  },
  url: V1.Me
}

describe("authenticate", () => {
  const fakeDataStore = new FakeDataStore()
  let app: FastifyInstance
  const dynamoConfig = createAuditLogDynamoDbConfig()
  const auditLogGateway = new AuditLogDynamoGateway(dynamoConfig)

  beforeAll(async () => {
    app = await build({ auditLogGateway, dataStore: fakeDataStore })
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
    const spy = jest.spyOn(fakeDataStore, "fetchUserByUsername")
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
    const spy = jest.spyOn(fakeDataStore, "fetchUserByUsername")
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
    jest.spyOn(fakeDataStore, "fetchUserByUsername").mockRejectedValue(error)

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
