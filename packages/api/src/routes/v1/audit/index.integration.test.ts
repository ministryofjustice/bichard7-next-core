import type { CreateAudit } from "@moj-bichard7/common/types/CreateAudit"

import { V1 } from "@moj-bichard7/common/apiEndpoints/versionedEndpoints"
import { addWeeks, subWeeks } from "date-fns"
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
    const [encodedJwt] = await createUserAndJwtToken(testDatabaseGateway)

    const response = await app.inject({
      headers: { Authorization: `Bearer ${encodedJwt}`, "Content-Type": "application/json" },
      method: "POST",
      payload: {
        dateFrom: subWeeks(new Date(), 1),
        dateTo: new Date(),
        includedTypes: ["Triggers", "Exceptions"],
        volumeOfCases: 20
      } satisfies CreateAudit,
      url: V1.Audit
    })

    expect(response.statusCode).toBe(CREATED)
  })

  it("returns 400 Bad Request when request body is invalid", async () => {
    const [encodedJwt] = await createUserAndJwtToken(testDatabaseGateway)

    const response = await app.inject({
      headers: { Authorization: `Bearer ${encodedJwt}`, "Content-Type": "application/json" },
      method: "POST",
      payload: {
        dateFrom: new Date(),
        dateTo: addWeeks(new Date(), 7), // Date ranges in the future should be reject
        includedTypes: ["Triggers", "Exceptions"],
        volumeOfCases: 20
      },
      url: V1.Audit
    })

    expect(response.statusCode).toBe(BAD_REQUEST)
  })
})
