import type { FastifyInstance, InjectOptions } from "fastify"

import { V1 } from "@moj-bichard7/common/apiEndpoints/versionedEndpoints"
import { NOT_FOUND, OK } from "http-status"

import build from "../../../app"
import AuditLogDynamoGateway from "../../../services/gateways/dynamo/AuditLogDynamoGateway/AuditLogDynamoGateway"
import { testAhoJsonStr } from "../../../tests/helpers/ahoHelper"
import { createCase } from "../../../tests/helpers/caseHelper"
import auditLogDynamoConfig from "../../../tests/helpers/dynamoDbConfig"
import { createUser, generateJwtForStaticUser } from "../../../tests/helpers/userHelper"
import End2EndPostgres from "../../../tests/testGateways/e2ePostgres"

const defaultInjectParams = (jwt: string, caseId: string): InjectOptions => {
  return {
    headers: { authorization: "Bearer {{ token }}".replace("{{ token }}", jwt) },
    method: "GET",
    url: V1.Case.replace(":caseId", caseId)
  }
}

describe("retrieve a case", () => {
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

  afterEach(() => {
    jest.restoreAllMocks()
  })

  afterAll(async () => {
    await testDatabaseGateway.close()
    await app.close()
  })

  it("returns a case with response code OK when case exists", async () => {
    const [encodedJwt, user] = generateJwtForStaticUser()
    await createUser(testDatabaseGateway, { jwtId: user.jwtId, username: user.username })
    const caseObj = await createCase(testDatabaseGateway, { errorId: 1 })

    const response = await app.inject(defaultInjectParams(encodedJwt, String(caseObj.errorId)))

    expect(response.statusCode).toBe(OK)
    expect(response.json()).toEqual({
      aho: testAhoJsonStr,
      asn: "1901ID0100000006148H",
      canUserEditExceptions: true,
      courtCode: "ABC",
      courtDate: "2025-05-23T00:00:00.000Z",
      courtName: "Kingston Crown Court",
      courtReference: "ABC",
      defendantName: "Defendant",
      errorId: 1,
      errorLockedByUserFullName: "Forename1 Surname1",
      errorLockedByUsername: "User 1",
      errorReport: "HO100304||br7:ArrestSummonsNumber",
      errorStatus: "Unresolved",
      isUrgent: 1,
      messageReceivedAt: "2025-05-23T00:00:00.000Z",
      notes: [],
      orgForPoliceFilter: "01",
      phase: 1,
      ptiurn: "00112233",
      resolutionTimestamp: null,
      triggerCount: 1,
      triggerLockedByUserFullName: "Forename1 Surname1",
      triggerLockedByUsername: "User 1",
      triggers: [],
      triggerStatus: "Unresolved",
      updatedHearingOutcome: null
    })
  })

  it("returns response code 404 (NOT FOUND) when case doesn't exist", async () => {
    const [encodedJwt, user] = generateJwtForStaticUser()
    await createUser(testDatabaseGateway, { jwtId: user.jwtId, username: user.username })

    const response = await app.inject(defaultInjectParams(encodedJwt, "1"))

    expect(response.statusCode).toBe(NOT_FOUND)
  })
})
