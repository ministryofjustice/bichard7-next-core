import type { AuditDto } from "@moj-bichard7/common/types/Audit"
import type { CreateAudit } from "@moj-bichard7/common/types/CreateAudit"

import { V1 } from "@moj-bichard7/common/apiEndpoints/versionedEndpoints"
import { addDays, format, subWeeks } from "date-fns"
import { type FastifyInstance } from "fastify"
import { BAD_REQUEST, CREATED } from "http-status"

import build from "../../../app"
import AuditLogDynamoGateway from "../../../services/gateways/dynamo/AuditLogDynamoGateway/AuditLogDynamoGateway"
import auditLogDynamoConfig from "../../../tests/helpers/dynamoDbConfig"
import { createUserAndJwtToken } from "../../../tests/helpers/userHelper"
import End2EndPostgres from "../../../tests/testGateways/e2ePostgres"

describe("Create audit", () => {
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

  it("returns 201 CREATED when audit created successfully", async () => {
    const [encodedJwt, user] = await createUserAndJwtToken(testDatabaseGateway)
    const payload = {
      fromDate: format(subWeeks(new Date(), 1), "yyyy-MM-dd"),
      includedTypes: ["Triggers", "Exceptions"],
      toDate: format(new Date(), "yyyy-MM-dd"),
      volumeOfCases: 20
    } satisfies CreateAudit
    const response = await app.inject({
      headers: { Authorization: `Bearer ${encodedJwt}`, "Content-Type": "application/json" },
      method: "POST",
      payload,
      url: V1.Audit
    })

    expect(response.statusCode).toBe(CREATED)
    const body = response.json<AuditDto>()
    expect(body.auditId).toBeGreaterThan(0)
    expect(body.fromDate).toBe(payload.fromDate)
    expect(body.toDate).toBe(payload.toDate)
    expect(body.createdBy).toBe(user.username)
  })

  it("returns 400 Bad Request when date range is in the past", async () => {
    const [encodedJwt] = await createUserAndJwtToken(testDatabaseGateway)

    const response = await app.inject({
      headers: { Authorization: `Bearer ${encodedJwt}`, "Content-Type": "application/json" },
      method: "POST",
      payload: {
        fromDate: format(new Date(), "yyyy-MM-dd"),
        includedTypes: ["Triggers", "Exceptions"],
        toDate: format(addDays(new Date(), 1), "yyyy-MM-dd"), // Date ranges in the future should be rejected
        volumeOfCases: 20
      } satisfies CreateAudit,
      url: V1.Audit
    })

    expect(response.statusCode).toBe(BAD_REQUEST)
    expect(response.body).toContain("Date range cannot be in the future")
  })

  it("returns 400 Bad Request when no included types", async () => {
    const [encodedJwt] = await createUserAndJwtToken(testDatabaseGateway)

    const response = await app.inject({
      headers: { Authorization: `Bearer ${encodedJwt}`, "Content-Type": "application/json" },
      method: "POST",
      payload: {
        fromDate: format(subWeeks(new Date(), 1), "yyyy-MM-dd"),
        includedTypes: [],
        toDate: format(new Date(), "yyyy-MM-dd"), // Date ranges in the future should be rejected
        volumeOfCases: 20
      } satisfies CreateAudit,
      url: V1.Audit
    })

    expect(response.statusCode).toBe(BAD_REQUEST)
    expect(response.body).toContain("includedTypes")
  })
})
