/* eslint-disable jest/expect-expect */
import type { InjectOptions } from "fastify"
import type { FastifyInstance } from "fastify"

import { V1 } from "@moj-bichard7/common/apiEndpoints/versionedEndpoints"
import { UserGroup } from "@moj-bichard7/common/types/UserGroup"
import { randomUUID } from "crypto"
import { ACCEPTED, FORBIDDEN } from "http-status"

import type { ResubmitCases } from "./resubmitCases"

import build from "../../../app"
import AuditLogDynamoGateway from "../../../services/gateways/dynamo/AuditLogDynamoGateway/AuditLogDynamoGateway"
import HO100404 from "../../../tests/fixtures/HO100404.json"
import { createCases } from "../../../tests/helpers/caseHelper"
import auditLogDynamoConfig from "../../../tests/helpers/dynamoDbConfig"
import { generateJwtForStaticUser } from "../../../tests/helpers/userHelper"
import { createUser } from "../../../tests/helpers/userHelper"
import End2EndPostgres from "../../../tests/testGateways/e2ePostgres"

const defaultInjectParams = (jwt: string): InjectOptions => {
  return {
    headers: { authorization: "Bearer {{ token }}".replace("{{ token }}", jwt) },
    method: "POST",
    url: V1.CasesResubmit
  }
}

describe("/v1/cases/resubmit integration", () => {
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

  const assertStatusCode = async (encodedJwt: string, code: number) => {
    const { statusCode } = await app.inject(defaultInjectParams(encodedJwt))

    expect(statusCode).toBe(code)
  }

  it("will receive a 403 error if there's no Service group for the User", async () => {
    const [encodedJwt, user] = generateJwtForStaticUser([UserGroup.GeneralHandler])
    await createUser(testDatabaseGateway, {
      groups: [UserGroup.GeneralHandler],
      jwtId: user.jwtId,
      username: user.username
    })

    await assertStatusCode(encodedJwt, FORBIDDEN)
  })

  it("will work with a user with Service group", async () => {
    const [encodedJwt] = generateJwtForStaticUser([UserGroup.Service])

    await assertStatusCode(encodedJwt, ACCEPTED)
  })

  it("won't resubmit if there's no eligible Cases", async () => {
    const [encodedJwt] = generateJwtForStaticUser([UserGroup.Service])
    await createCases(testDatabaseGateway, 1, {
      0: {
        aho: HO100404.hearingOutcomeXml,
        errorCount: 1,
        errorLockedById: "testUser",
        errorReport: "HO100404||br7:ArrestSummonsNumber",
        messageId: randomUUID()
      }
    })

    const result = await app.inject(defaultInjectParams(encodedJwt))

    expect(result.statusCode).toBe(ACCEPTED)
    expect(result.json()).toEqual({})
  })

  it("will resubmit if there's eligible Cases", async () => {
    const [encodedJwt] = generateJwtForStaticUser([UserGroup.Service])
    const cases = await createCases(testDatabaseGateway, 1, {
      0: {
        aho: HO100404.hearingOutcomeXml,
        errorCount: 1,
        errorReport: "HO100404||br7:ArrestSummonsNumber",
        messageId: randomUUID()
      }
    })

    const result = await app.inject(defaultInjectParams(encodedJwt))

    expect(result.statusCode).toBe(ACCEPTED)

    const json = result.json() as ResubmitCases

    expect(json[cases[0].messageId]).toBeDefined()
    expect(json[cases[0].messageId]).not.toBeInstanceOf(Error)
    expect(json[cases[0].messageId]).toHaveProperty("errorId", cases[0].errorId)
    expect(json[cases[0].messageId]).toHaveProperty("workflowId")
  })
})
