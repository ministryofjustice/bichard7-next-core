import { V1 } from "@moj-bichard7/common/apiEndpoints/versionedEndpoints"
import { UserGroup } from "@moj-bichard7/common/types/UserGroup"
import { type FastifyInstance } from "fastify"
import { BAD_REQUEST, FORBIDDEN, NOT_FOUND, OK } from "http-status"

import build from "../../../../app"
import AuditLogDynamoGateway from "../../../../services/gateways/dynamo/AuditLogDynamoGateway/AuditLogDynamoGateway"
import auditLogDynamoConfig from "../../../../tests/helpers/dynamoDbConfig"
import { createUserAndJwtToken } from "../../../../tests/helpers/userHelper"
import End2EndPostgres from "../../../../tests/testGateways/e2ePostgres"

describe("GET /v1/audit/:auditId/cases", () => {
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

  it("returns 200 OK when retrieved audit cases", async () => {
    const [encodedJwt] = await createUserAndJwtToken(testDatabaseGateway, [UserGroup.Supervisor])

    const response = await app.inject({
      headers: { Authorization: `Bearer ${encodedJwt}`, "Content-Type": "application/json" },
      method: "GET",
      url: V1.AuditCases.replace(":auditId", "1")
    })

    expect(response.statusCode).toBe(OK)
  })

  it("returns 400 Bad Request when auditId is not a number", async () => {
    const [encodedJwt] = await createUserAndJwtToken(testDatabaseGateway, [UserGroup.Supervisor])

    const response = await app.inject({
      headers: { Authorization: `Bearer ${encodedJwt}`, "Content-Type": "application/json" },
      method: "GET",
      url: V1.AuditCases.replace(":auditId", "test_value")
    })

    expect(response.statusCode).toBe(BAD_REQUEST)
    expect(response.body).toContain("auditId")
  })

  it("returns 400 Bad Request when max per page is outside limits", async () => {
    const [encodedJwt] = await createUserAndJwtToken(testDatabaseGateway, [UserGroup.Supervisor])

    const query = new URLSearchParams()
    query.set("maxPerPage", "1000")

    const response = await app.inject({
      headers: { Authorization: `Bearer ${encodedJwt}`, "Content-Type": "application/json" },
      method: "GET",
      query: query.toString(),
      url: V1.AuditCases.replace(":auditId", "1")
    })

    expect(response.statusCode).toBe(BAD_REQUEST)
    expect(response.body).toContain("maxPerPage")
  })

  it("returns 403 when user does not have permission to get audit cases", async () => {
    const [encodedJwt] = await createUserAndJwtToken(testDatabaseGateway, [UserGroup.GeneralHandler])

    const response = await app.inject({
      headers: { Authorization: `Bearer ${encodedJwt}`, "Content-Type": "application/json" },
      method: "GET",
      url: V1.AuditCases.replace(":auditId", "1")
    })

    expect(response.statusCode).toBe(FORBIDDEN)
  })

  it("returns 404 when the audit does not exist", async () => {
    const [encodedJwt] = await createUserAndJwtToken(testDatabaseGateway, [UserGroup.Supervisor])

    const response = await app.inject({
      headers: { Authorization: `Bearer ${encodedJwt}`, "Content-Type": "application/json" },
      method: "GET",
      url: V1.AuditCases.replace(":auditId", "1")
    })

    expect(response.statusCode).toBe(NOT_FOUND)
  })
})
