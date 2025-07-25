import type { FastifyInstance } from "fastify"

import { V1 } from "@moj-bichard7/common/apiEndpoints/versionedEndpoints"
import { OK, UNAUTHORIZED } from "http-status"

import build from "../../app"
import AuditLogDynamoGateway from "../../services/gateways/dynamo/AuditLogDynamoGateway/AuditLogDynamoGateway"
import createAuditLogDynamoDbConfig from "../../services/gateways/dynamo/createAuditLogDynamoDbConfig"
import { createUser, generateJwtForStaticUser } from "../../tests/helpers/userHelper"
import End2EndPostgres from "../../tests/testGateways/e2ePostgres"

const testDatabaseGateway = new End2EndPostgres()

const defaults = { headers: { Authorization: "Bearer " }, url: V1.Me }

describe("authenticate", () => {
  let app: FastifyInstance
  const dynamoConfig = createAuditLogDynamoDbConfig()
  const auditLogGateway = new AuditLogDynamoGateway(dynamoConfig)

  beforeAll(async () => {
    app = await build({ auditLogGateway, database: testDatabaseGateway })
    await app.ready()
  })

  beforeEach(async () => {
    await testDatabaseGateway.clearDb()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  afterAll(async () => {
    await testDatabaseGateway.close()
    await app.close()
  })

  it("will return with no headers 401 - Unauthorized", async () => {
    const response = await app.inject({ ...defaults, headers: {} })

    expect(response.statusCode).toBe(UNAUTHORIZED)
  })

  it("returns 401 if jwt doesn't start with Bearer", async () => {
    const { statusCode } = await app.inject({
      ...defaults,
      headers: { ...defaults.headers, Authorization: "Not Bearer " }
    })

    expect(statusCode).toBe(UNAUTHORIZED)
  })

  it("returns 401 if jwt can't be parsed", async () => {
    const invalidJwt = "abc123"

    const { statusCode } = await app.inject({
      ...defaults,
      headers: { ...defaults.headers, Authorization: `Bearer ${invalidJwt}` }
    })

    expect(statusCode).toBe(UNAUTHORIZED)
  })

  it("returns 401 if the verification result is false", async () => {
    const { statusCode } = await app.inject({ ...defaults })

    expect(statusCode).toBe(UNAUTHORIZED)
  })

  it("will return 401 - Unauthorized with a missing user", async () => {
    const [encodedJwt] = generateJwtForStaticUser()

    const response = await app.inject({
      ...defaults,
      headers: { ...defaults.headers, authorization: `Bearer ${encodedJwt}` }
    })

    expect(response.statusCode).toBe(UNAUTHORIZED)
  })

  it("returns 200 if the verification result is a User", async () => {
    const [encodedJwt, user] = generateJwtForStaticUser()
    await createUser(testDatabaseGateway, { groups: user.groups, jwtId: user.jwtId, username: user.username })
    const { statusCode } = await app.inject({
      ...defaults,
      headers: { ...defaults.headers, authorization: `Bearer ${encodedJwt}` }
    })

    expect(statusCode).toBe(OK)
  })

  // TODO: Write test for 502 error (IO error)
  // it("returns 502 when db failed to respond", async () => {
  //   const [encodedJwt, user] = generateJwtForStaticUser()
  //   await createUser(testDatabaseGateway, { groups: user.groups, jwtId: user.jwtId, username: user.username })

  //   jest
  //     .spyOn(testDatabaseGateway.writable, "connection")
  //     .mockResolvedValue(Error("Dummy error") as unknown as RowList<readonly (object | undefined)[]>)

  //   const { statusCode } = await app.inject({
  //     ...defaults,
  //     headers: { ...defaults.headers, authorization: `Bearer ${encodedJwt}` }
  //   })

  //   expect(statusCode).toBe(BAD_GATEWAY)
  // })
})
