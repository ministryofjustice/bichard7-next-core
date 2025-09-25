import { V1 } from "@moj-bichard7/common/apiEndpoints/versionedEndpoints"
import { type FastifyInstance } from "fastify"
import { BAD_REQUEST, NOT_FOUND, OK } from "http-status"

import build from "../../../app"
import AuditLogDynamoGateway from "../../../services/gateways/dynamo/AuditLogDynamoGateway/AuditLogDynamoGateway"
import { createCase } from "../../../tests/helpers/caseHelper"
import auditLogDynamoConfig from "../../../tests/helpers/dynamoDbConfig"
import { createUserAndJwtToken } from "../../../tests/helpers/userHelper"
import End2EndPostgres from "../../../tests/testGateways/e2ePostgres"

describe("saveAuditResults", () => {
  let app: FastifyInstance
  const testDatabaseGateway = new End2EndPostgres()
  const auditLogGateway = new AuditLogDynamoGateway(auditLogDynamoConfig)

  beforeAll(async () => {
    app = await build({ auditLogGateway, database: testDatabaseGateway })
    await app.ready()
  })

  beforeEach(async () => {
    await testDatabaseGateway.clearDb()
    await createCase(testDatabaseGateway)
  })

  afterAll(async () => {
    await testDatabaseGateway.close()
    await app.close()
  })

  it("returns 200 OK when audit quality saved successfully", async () => {
    const [encodedJwt] = await createUserAndJwtToken(testDatabaseGateway)

    const response = await app.inject({
      headers: { Authorization: `Bearer ${encodedJwt}`, "Content-Type": "application/json" },
      method: "POST",
      payload: { errorQuality: 1, triggerQuality: 2 },
      url: V1.CaseAudit.replace(":caseId", "1")
    })

    expect(response.statusCode).toBe(OK)
  })

  it("returns 400 Bad Request when request body is invalid", async () => {
    const [encodedJwt] = await createUserAndJwtToken(testDatabaseGateway)

    const response = await app.inject({
      headers: { Authorization: `Bearer ${encodedJwt}`, "Content-Type": "application/json" },
      method: "POST",
      payload: {},
      url: V1.CaseAudit.replace(":caseId", "1")
    })

    expect(response.statusCode).toBe(BAD_REQUEST)
  })

  it("returns 404 Not Found when there's no case found", async () => {
    const [encodedJwt] = await createUserAndJwtToken(testDatabaseGateway)

    const response = await app.inject({
      headers: { Authorization: `Bearer ${encodedJwt}`, "Content-Type": "application/json" },
      method: "POST",
      payload: { errorQuality: 1, triggerQuality: 2 },
      url: V1.CaseAudit.replace(":caseId", "2")
    })

    expect(response.statusCode).toBe(NOT_FOUND)
  })
})
