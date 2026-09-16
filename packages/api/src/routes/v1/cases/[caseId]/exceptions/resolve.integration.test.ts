import type { FastifyInstance, InjectOptions } from "fastify"

import { V1 } from "@moj-bichard7/common/apiEndpoints/versionedEndpoints"
import { ResolutionStatusNumber } from "@moj-bichard7/common/types/ResolutionStatus"
import { UserGroup } from "@moj-bichard7/common/types/UserGroup"
import { BAD_REQUEST, FORBIDDEN, NOT_FOUND, OK, UNPROCESSABLE_ENTITY } from "http-status"

import build from "../../../../../app"
import { AuditLogDynamoGateway } from "../../../../../services/gateways/dynamo"
import { createCase } from "../../../../../tests/helpers/caseHelper"
import auditLogDynamoConfig from "../../../../../tests/helpers/dynamoDbConfig"
import { createUserAndJwtToken } from "../../../../../tests/helpers/userHelper"
import End2EndPostgres from "../../../../../tests/testGateways/e2ePostgres"

const defaultInjectParams = (
  jwt: string,
  caseId: string,
  body: Record<string, unknown> = {
    reason: "UpdatedDisposal",
    reasonText: "Test comment"
  }
): InjectOptions => {
  return {
    headers: { authorization: "Bearer {{ token }}".replace("{{ token }}", jwt) },
    method: "POST",
    payload: body,
    url: V1.CaseExceptionsResolve.replace(":caseId", caseId)
  }
}

describe("resolve integration", () => {
  let app: FastifyInstance
  const testDatabaseGateway = new End2EndPostgres()
  const auditLogGateway = new AuditLogDynamoGateway(auditLogDynamoConfig)

  beforeAll(async () => {
    app = await build({ auditLogGateway, database: testDatabaseGateway })
    await app.ready()
  })

  beforeEach(async () => {
    await testDatabaseGateway.clearDb()
    jest.clearAllMocks()

    jest.spyOn(auditLogGateway, "fetchOne").mockResolvedValue({
      events: [],
      messageId: "mock-message-id",
      version: 1
    } as any)

    jest.spyOn(auditLogGateway, "update").mockResolvedValue(undefined as any)
  })

  afterAll(async () => {
    await testDatabaseGateway.close()
    await app.close()
  })

  describe("200 OK", () => {
    it("will receive a 200 if the case is found and unresolved, with GeneralHandler permission", async () => {
      const [encodedJwt, user] = await createUserAndJwtToken(testDatabaseGateway, [UserGroup.GeneralHandler])
      const caseObj = await createCase(testDatabaseGateway, {
        errorId: 1,
        errorLockedById: user.username,
        errorStatus: ResolutionStatusNumber.Unresolved
      })

      const response = await app.inject(defaultInjectParams(encodedJwt, String(caseObj.errorId)))

      expect(response.statusCode).toBe(OK)
    })

    it("will receive a 200 if the case is found and unresolved, with ExceptionHandler permission", async () => {
      const [encodedJwt, user] = await createUserAndJwtToken(testDatabaseGateway, [UserGroup.ExceptionHandler])
      const caseObj = await createCase(testDatabaseGateway, {
        errorId: 1,
        errorLockedById: user.username,
        errorStatus: ResolutionStatusNumber.Unresolved
      })

      const response = await app.inject(defaultInjectParams(encodedJwt, String(caseObj.errorId)))

      expect(response.statusCode).toBe(OK)
    })

    it("will receive a 200 if the user's visible courts match", async () => {
      const [encodedJwt, user] = await createUserAndJwtToken(testDatabaseGateway, [UserGroup.GeneralHandler], {
        visibleCourts: ["ABC"],
        visibleForces: ["DEF"]
      })
      const caseObj = await createCase(testDatabaseGateway, {
        courtCode: "ABC",
        errorId: 1,
        errorLockedById: user.username,
        errorStatus: ResolutionStatusNumber.Unresolved,
        orgForPoliceFilter: "ABC"
      })

      const response = await app.inject(defaultInjectParams(encodedJwt, String(caseObj.errorId)))

      expect(response.statusCode).toBe(OK)
    })

    it("will receive a 200 if the user's visible forces match", async () => {
      const [encodedJwt, user] = await createUserAndJwtToken(testDatabaseGateway, [UserGroup.GeneralHandler], {
        visibleCourts: ["DEF"]
      })
      const caseObj = await createCase(testDatabaseGateway, {
        courtCode: "ABC",
        errorId: 1,
        errorLockedById: user.username,
        errorStatus: ResolutionStatusNumber.Unresolved,
        orgForPoliceFilter: "01"
      })

      const response = await app.inject(defaultInjectParams(encodedJwt, String(caseObj.errorId)))

      expect(response.statusCode).toBe(OK)
    })
  })

  describe("400 BadRequest", () => {
    it("will receive 400 BadRequest if request body is empty", async () => {
      const [encodedJwt] = await createUserAndJwtToken(testDatabaseGateway, [UserGroup.GeneralHandler])

      const response = await app.inject(defaultInjectParams(encodedJwt, String(1), {}))

      expect(response.statusCode).toBe(BAD_REQUEST)
    })

    it("will receive 400 BadRequest if request body reason property is invalid", async () => {
      const [encodedJwt] = await createUserAndJwtToken(testDatabaseGateway, [UserGroup.GeneralHandler])

      const response = await app.inject(
        defaultInjectParams(encodedJwt, String(1), {
          reason: "InvalidReason",
          reasonText: "Test comment"
        })
      )

      expect(response.statusCode).toBe(BAD_REQUEST)
    })

    it("will receive 400 BadRequest if request body reasonText property is invalid", async () => {
      const [encodedJwt] = await createUserAndJwtToken(testDatabaseGateway, [UserGroup.GeneralHandler])

      const response = await app.inject(
        defaultInjectParams(encodedJwt, String(1), {
          reason: "UpdatedDisposal",
          reasonText: 123
        })
      )

      expect(response.statusCode).toBe(BAD_REQUEST)
    })
  })

  describe("403 Forbidden", () => {
    it("will receive 403 Forbidden if the user has TriggerHandler role only", async () => {
      const [encodedJwt, user] = await createUserAndJwtToken(testDatabaseGateway, [UserGroup.TriggerHandler])
      const caseObj = await createCase(testDatabaseGateway, {
        errorId: 1,
        errorLockedById: user.username,
        errorStatus: ResolutionStatusNumber.Unresolved
      })

      const response = await app.inject(defaultInjectParams(encodedJwt, String(caseObj.errorId)))

      expect(response.statusCode).toBe(FORBIDDEN)
    })
  })

  describe("404 NotFound", () => {
    it("will receive 404 NotFound if the case exists but is already resolved", async () => {
      const [encodedJwt, user] = await createUserAndJwtToken(testDatabaseGateway, [UserGroup.GeneralHandler])
      const caseObj = await createCase(testDatabaseGateway, {
        errorId: 1,
        errorLockedById: user.username,
        errorStatus: ResolutionStatusNumber.Resolved
      })

      const response = await app.inject(defaultInjectParams(encodedJwt, String(caseObj.errorId)))

      expect(response.statusCode).toBe(NOT_FOUND)
    })

    it("will receive 404 NotFound if the case id doesn't exist", async () => {
      const [encodedJwt] = await createUserAndJwtToken(testDatabaseGateway, [UserGroup.GeneralHandler])

      const response = await app.inject(defaultInjectParams(encodedJwt, String(999)))

      expect(response.statusCode).toBe(NOT_FOUND)
    })
    it("will receive 404 NotFound when user's visibleCourt and visibleForce don't match the case", async () => {
      const [encodedJwt, user] = await createUserAndJwtToken(testDatabaseGateway, [UserGroup.GeneralHandler], {
        visibleCourts: ["DEF"],
        visibleForces: ["DEF"]
      })
      const caseObj = await createCase(testDatabaseGateway, {
        courtCode: "ABC",
        errorId: 1,
        errorLockedById: user.username,
        errorStatus: ResolutionStatusNumber.Unresolved,
        orgForPoliceFilter: "ABC"
      })

      const response = await app.inject(defaultInjectParams(encodedJwt, String(caseObj.errorId)))

      expect(response.statusCode).toBe(NOT_FOUND)
    })
  })

  it("will receive 422 UnprocessableEntityError if the case is locked to another user", async () => {
    const [encodedJwt] = await createUserAndJwtToken(testDatabaseGateway, [UserGroup.GeneralHandler])
    const caseObj = await createCase(testDatabaseGateway, {
      errorId: 1,
      errorLockedById: "other_user",
      errorStatus: ResolutionStatusNumber.Unresolved
    })

    const response = await app.inject(defaultInjectParams(encodedJwt, String(caseObj.errorId)))

    expect(response.statusCode).toBe(UNPROCESSABLE_ENTITY)
  })
})
