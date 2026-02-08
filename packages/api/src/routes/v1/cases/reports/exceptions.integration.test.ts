import type { FastifyInstance } from "fastify"

import { V1 } from "@moj-bichard7/common/apiEndpoints/versionedEndpoints"
import { UserGroup } from "@moj-bichard7/common/types/UserGroup"
import { addDays } from "date-fns"
import { BAD_REQUEST, FORBIDDEN, OK } from "http-status"

import type { AuditLogDynamoGateway } from "../../../../services/gateways/dynamo"

import build from "../../../../app"
import { createUserAndJwtToken } from "../../../../tests/helpers/userHelper"
import End2EndPostgres from "../../../../tests/testGateways/e2ePostgres"

describe("exceptions report", () => {
  let app: FastifyInstance
  const testDatabaseGateway = new End2EndPostgres()

  beforeAll(async () => {
    app = await build({ auditLogGateway: {} as AuditLogDynamoGateway, database: testDatabaseGateway })
    await app.ready()
  })

  beforeEach(async () => {
    await testDatabaseGateway.clearDb()
  })

  afterAll(async () => {
    await testDatabaseGateway.close()
    await app.close()
  })

  it("gives 400 error with no params", async () => {
    const [jwt] = await createUserAndJwtToken(testDatabaseGateway, [UserGroup.Supervisor])

    const { statusCode } = await app.inject({
      headers: { authorization: "Bearer {{ token }}".replace("{{ token }}", jwt) },
      method: "GET",
      url: V1.CasesReportsExceptions
    })

    expect(statusCode).toBe(BAD_REQUEST)
  })

  it("succeeds with params", async () => {
    const [jwt] = await createUserAndJwtToken(testDatabaseGateway, [UserGroup.Supervisor])

    const query = new URLSearchParams()
    query.append("fromDate", new Date().toISOString())
    query.append("toDate", new Date().toISOString())
    query.append("exceptions", "true")
    query.append("triggers", "true")

    const { statusCode } = await app.inject({
      headers: { authorization: "Bearer {{ token }}".replace("{{ token }}", jwt) },
      method: "GET",
      url: `${V1.CasesReportsExceptions}?${query.toString()}`
    })

    expect(statusCode).toBe(OK)
  })

  it("fails with the wrong permissions", async () => {
    const [jwt] = await createUserAndJwtToken(testDatabaseGateway, [UserGroup.GeneralHandler])

    const query = new URLSearchParams()
    query.append("fromDate", new Date().toISOString())
    query.append("toDate", new Date().toISOString())
    query.append("exceptions", "true")
    query.append("triggers", "true")

    const { statusCode } = await app.inject({
      headers: { authorization: "Bearer {{ token }}".replace("{{ token }}", jwt) },
      method: "GET",
      url: `${V1.CasesReportsExceptions}?${query.toString()}`
    })

    expect(statusCode).toBe(FORBIDDEN)
  })

  it("will fail with exceptions and triggers set to false", async () => {
    const [jwt] = await createUserAndJwtToken(testDatabaseGateway, [UserGroup.Supervisor])

    const query = new URLSearchParams()
    query.append("fromDate", new Date().toISOString())
    query.append("toDate", new Date().toISOString())
    query.append("exceptions", "false")
    query.append("triggers", "false")

    const { statusCode } = await app.inject({
      headers: { authorization: "Bearer {{ token }}".replace("{{ token }}", jwt) },
      method: "GET",
      url: `${V1.CasesReportsExceptions}?${query.toString()}`
    })

    expect(statusCode).toBe(BAD_REQUEST)
  })

  it("fails if the fromDate is before the toDate", async () => {
    const [jwt] = await createUserAndJwtToken(testDatabaseGateway, [UserGroup.Supervisor])

    const query = new URLSearchParams()
    query.append("fromDate", addDays(new Date(), 1).toISOString())
    query.append("toDate", new Date().toISOString())
    query.append("exceptions", "true")
    query.append("triggers", "true")

    const { statusCode } = await app.inject({
      headers: { authorization: "Bearer {{ token }}".replace("{{ token }}", jwt) },
      method: "GET",
      url: `${V1.CasesReportsExceptions}?${query.toString()}`
    })

    expect(statusCode).toBe(BAD_REQUEST)
  })
})
