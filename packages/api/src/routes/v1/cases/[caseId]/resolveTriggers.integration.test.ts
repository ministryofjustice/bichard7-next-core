import { expect } from "@jest/globals"
import { V1 } from "@moj-bichard7/common/apiEndpoints/versionedEndpoints"
import { UserGroup } from "@moj-bichard7/common/types/UserGroup"
import { type FastifyInstance } from "fastify"
import { NOT_FOUND, OK } from "http-status"

import build from "../../../../app"
import AuditLogDynamoGateway from "../../../../services/gateways/dynamo/AuditLogDynamoGateway/AuditLogDynamoGateway"
import { createCase } from "../../../../tests/helpers/caseHelper"
import auditLogDynamoConfig from "../../../../tests/helpers/dynamoDbConfig"
import { createTriggers } from "../../../../tests/helpers/triggerHelper"
import { createUserAndJwtToken } from "../../../../tests/helpers/userHelper"
import End2EndPostgres from "../../../../tests/testGateways/e2ePostgres"

describe("resolveTriggers", () => {
  let app: FastifyInstance
  const testDatabaseGateway = new End2EndPostgres()
  const auditLogGateway = new AuditLogDynamoGateway(auditLogDynamoConfig)
  const insertedTriggers = [{ triggerCode: "TRPR0001", triggerId: 1 }]

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

  it("returns 200 OK when triggers are successfully resolved", async () => {
    const [encodedJwt, user] = await createUserAndJwtToken(testDatabaseGateway, [UserGroup.GeneralHandler])
    const caseObj = await createCase(testDatabaseGateway, { triggerLockedById: user.username })
    await createTriggers(testDatabaseGateway, caseObj.errorId, insertedTriggers)

    const response = await app.inject({
      headers: { Authorization: `Bearer ${encodedJwt}`, "Content-Type": "application/json" },
      method: "POST",
      payload: {
        triggerIds: [insertedTriggers[0].triggerId]
      },
      url: V1.CasesResolveTriggers.replace(":caseId", caseObj.errorId.toString())
    })

    expect(response.statusCode).toBe(OK)
  })

  it("returns 404 Not Found when the case does not exist", async () => {
    const [encodedJwt] = await createUserAndJwtToken(testDatabaseGateway, [UserGroup.GeneralHandler])

    const response = await app.inject({
      headers: { Authorization: `Bearer ${encodedJwt}`, "Content-Type": "application/json" },
      method: "POST",
      payload: {
        triggerIds: [insertedTriggers[0].triggerId]
      },
      url: V1.CasesResolveTriggers.replace(":caseId", "999")
    })

    expect(response.statusCode).toBe(NOT_FOUND)
  })

  it("returns 404 Not Found when the case has no triggers to resolve", async () => {
    const [encodedJwt] = await createUserAndJwtToken(testDatabaseGateway, [UserGroup.GeneralHandler])
    const caseObj = await createCase(testDatabaseGateway)

    const response = await app.inject({
      headers: { Authorization: `Bearer ${encodedJwt}`, "Content-Type": "application/json" },
      method: "POST",
      payload: {
        triggerIds: [insertedTriggers[0].triggerId]
      },
      url: V1.CasesResolveTriggers.replace(":caseId", caseObj.errorId.toString())
    })

    expect(response.statusCode).toBe(404)
  })

  it("returns 500 Internal Server Error when an unexpected error occurs", async () => {
    const [encodedJwt] = await createUserAndJwtToken(testDatabaseGateway, [UserGroup.GeneralHandler])

    const response = await app.inject({
      headers: { Authorization: `Bearer ${encodedJwt}`, "Content-Type": "application/json" },
      method: "POST",
      payload: {
        triggerIds: [insertedTriggers[0].triggerId]
      },
      url: V1.CasesResolveTriggers.replace(":caseId", "invalid-case-id")
    })

    expect(response.statusCode).toBe(500)
  })
})
