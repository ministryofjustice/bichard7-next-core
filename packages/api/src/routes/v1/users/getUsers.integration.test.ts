import type { FastifyInstance } from "fastify"

import { V1 } from "@moj-bichard7/common/apiEndpoints/versionedEndpoints"
import { UserGroup } from "@moj-bichard7/common/types/UserGroup"
import { FORBIDDEN, OK } from "http-status"

import build from "../../../app"
import { AuditLogDynamoGateway } from "../../../services/gateways/dynamo"
import auditLogDynamoConfig from "../../../tests/helpers/dynamoDbConfig"
import { createUser, createUserAndJwtToken } from "../../../tests/helpers/userHelper"
import End2EndPostgres from "../../../tests/testGateways/e2ePostgres"

describe("GET /v1/audit/users", () => {
  let app: FastifyInstance
  const testDatabaseGateway = new End2EndPostgres()
  const auditLogGateway = new AuditLogDynamoGateway(auditLogDynamoConfig)

  beforeAll(async () => {
    app = await build({ auditLogGateway, database: testDatabaseGateway })
    await app.ready()
  })

  beforeEach(async () => {
    await testDatabaseGateway.clearDb()
  })

  afterAll(async () => {
    await testDatabaseGateway.close()
    await app.close()
  })

  it("returns 200 OK with retrieved user list", async () => {
    const [encodedJwt] = await createUserAndJwtToken(testDatabaseGateway, [UserGroup.Supervisor])
    await createUser(testDatabaseGateway, {
      username: "username01"
    })
    await createUser(testDatabaseGateway, {
      username: "username02"
    })

    const response = await app.inject({
      headers: { Authorization: `Bearer ${encodedJwt}`, "Content-Type": "application/json" },
      method: "GET",
      url: V1.Users
    })

    expect(response.statusCode).toBe(OK)
    const body = await response.json()

    expect(body.users).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ username: "username01" }),
        expect.objectContaining({ username: "username02" })
      ])
    )
  })

  it("returns 403 Forbidden for unauthorised user", async () => {
    const [encodedJwt] = await createUserAndJwtToken(testDatabaseGateway, [UserGroup.GeneralHandler])

    const response = await app.inject({
      headers: { Authorization: `Bearer ${encodedJwt}` },
      method: "GET",
      url: V1.Users
    })

    expect(response.statusCode).toBe(FORBIDDEN)
  })
})
