import type { AuditDto } from "@moj-bichard7/common/types/Audit"

import { V1 } from "@moj-bichard7/common/apiEndpoints/versionedEndpoints"
import { isError } from "@moj-bichard7/common/types/Result"
import { UserGroup } from "@moj-bichard7/common/types/UserGroup"
import { format, subDays, subWeeks } from "date-fns"
import { type FastifyInstance } from "fastify"
import { BAD_REQUEST, FORBIDDEN, NOT_FOUND, OK } from "http-status"

import build from "../../../../app"
import { insertAudit } from "../../../../services/db/audit/insertAudit"
import { insertAuditCases } from "../../../../services/db/audit/insertAuditCases"
import AuditLogDynamoGateway from "../../../../services/gateways/dynamo/AuditLogDynamoGateway/AuditLogDynamoGateway"
import { createCase } from "../../../../tests/helpers/caseHelper"
import auditLogDynamoConfig from "../../../../tests/helpers/dynamoDbConfig"
import { createUserAndJwtToken } from "../../../../tests/helpers/userHelper"
import End2EndPostgres from "../../../../tests/testGateways/e2ePostgres"

describe("GET /v1/audit/:auditId", () => {
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

  it("returns 200 OK with retrieved audit", async () => {
    const [encodedJwt, user] = await createUserAndJwtToken(testDatabaseGateway, [UserGroup.Supervisor])
    const cases = await Promise.all([
      createCase(testDatabaseGateway, {
        courtCode: user.visibleCourts[0],
        errorId: 1,
        orgForPoliceFilter: user.visibleForces[0],
        triggerQualityChecked: 1,
        triggerResolvedAt: subDays(new Date(), 1),
        triggerResolvedBy: "user1"
      }),
      createCase(testDatabaseGateway, {
        courtCode: user.visibleCourts[0],
        errorId: 2,
        errorResolvedAt: subDays(new Date(), 1),
        errorResolvedBy: "user1",
        orgForPoliceFilter: user.visibleForces[0]
      })
    ])
    const fromDate = format(subWeeks(new Date(), 1), "yyyy-MM-dd")
    const toDate = format(new Date(), "yyyy-MM-dd")
    const audit = await insertAudit(
      testDatabaseGateway.writable,
      {
        fromDate,
        includedTypes: ["Triggers", "Exceptions"],
        resolvedByUsers: ["user1"],
        toDate,
        volumeOfCases: 20
      },
      user
    )
    expect(isError(audit)).toBe(false)

    const auditCases = await insertAuditCases(
      testDatabaseGateway.writable,
      (audit as AuditDto).auditId,
      cases.map((c) => c.errorId)
    )
    expect(isError(auditCases)).toBe(false)

    const response = await app.inject({
      headers: { Authorization: `Bearer ${encodedJwt}`, "Content-Type": "application/json" },
      method: "GET",
      url: V1.AuditById.replace(":auditId", (audit as AuditDto).auditId.toString())
    })

    expect(response.statusCode).toBe(OK)
    const body = await response.json()
    expect(body).toEqual({
      auditedCases: 1,
      auditId: expect.any(Number),
      completedWhen: null,
      createdBy: user.username,
      createdWhen: expect.any(String),
      fromDate,
      includedTypes: ["Triggers", "Exceptions"],
      resolvedByUsers: ["user1"],
      toDate,
      totalCases: 2,
      triggerTypes: null,
      volumeOfCases: 20
    })
  })

  it("returns 400 Bad Request when auditId is not a number", async () => {
    const [encodedJwt] = await createUserAndJwtToken(testDatabaseGateway, [UserGroup.Supervisor])

    const response = await app.inject({
      headers: { Authorization: `Bearer ${encodedJwt}`, "Content-Type": "application/json" },
      method: "GET",
      url: V1.AuditById.replace(":auditId", "test_value")
    })

    expect(response.statusCode).toBe(BAD_REQUEST)
    expect(response.body).toContain("auditId")
  })

  it("returns 403 when user does not have permission to get audits", async () => {
    const [encodedJwt] = await createUserAndJwtToken(testDatabaseGateway, [UserGroup.GeneralHandler])

    const response = await app.inject({
      headers: { Authorization: `Bearer ${encodedJwt}`, "Content-Type": "application/json" },
      method: "GET",
      url: V1.AuditById.replace(":auditId", "1")
    })

    expect(response.statusCode).toBe(FORBIDDEN)
  })

  it("returns 404 when the audit does not exist", async () => {
    const [encodedJwt] = await createUserAndJwtToken(testDatabaseGateway, [UserGroup.Supervisor])

    const response = await app.inject({
      headers: { Authorization: `Bearer ${encodedJwt}`, "Content-Type": "application/json" },
      method: "GET",
      url: V1.AuditById.replace(":auditId", "1")
    })

    expect(response.statusCode).toBe(NOT_FOUND)
  })

  it("returns 404 when audit exists but for another user", async () => {
    const [encodedJwt, user] = await createUserAndJwtToken(testDatabaseGateway, [UserGroup.Supervisor])
    const audit = await insertAudit(
      testDatabaseGateway.writable,
      {
        fromDate: format(subWeeks(new Date(), 1), "yyyy-MM-dd"),
        includedTypes: ["Triggers", "Exceptions"],
        resolvedByUsers: ["user1"],
        toDate: format(new Date(), "yyyy-MM-dd"),
        volumeOfCases: 20
      },
      { ...user, username: "another_user" }
    )
    expect(isError(audit)).toBe(false)

    const response = await app.inject({
      headers: { Authorization: `Bearer ${encodedJwt}`, "Content-Type": "application/json" },
      method: "GET",
      url: V1.AuditById.replace(":auditId", (audit as AuditDto).auditId.toString())
    })

    expect(response.statusCode).toBe(NOT_FOUND)
  })
})
