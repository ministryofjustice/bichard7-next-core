/* eslint-disable jest/expect-expect */
import type { User } from "@moj-bichard7/common/types/User"
import type { FastifyInstance, InjectOptions } from "fastify"

import { V1 } from "@moj-bichard7/common/apiEndpoints/versionedEndpoints"
import { UserGroup } from "@moj-bichard7/common/types/UserGroup"
import { BAD_GATEWAY, BAD_REQUEST, FORBIDDEN, OK } from "http-status"

import build from "../../../app"
import canCaseBeResubmitted from "../../../services/db/cases/canCaseBeResubmitted"
import AuditLogDynamoGateway from "../../../services/gateways/dynamo/AuditLogDynamoGateway/AuditLogDynamoGateway"
import { createCase } from "../../../tests/helpers/caseHelper"
import auditLogDynamoConfig from "../../../tests/helpers/dynamoDbConfig"
import { createUser, generateJwtForStaticUser } from "../../../tests/helpers/userHelper"
import End2EndPostgres from "../../../tests/testGateways/e2ePostgres"
import { ResolutionStatusNumber } from "../../../useCases/dto/convertResolutionStatus"

jest.mock("../../../services/db/cases/canCaseBeResubmitted")

const mockedCanCaseBeResubmitted = canCaseBeResubmitted as jest.Mock

const defaultInjectParams = (jwt: string): InjectOptions => {
  return {
    body: { phase: 1 },
    headers: { authorization: "Bearer {{ token }}".replace("{{ token }}", jwt) },
    method: "POST",
    url: V1.CaseResubmit.replace(":caseId", "100")
  }
}

describe("resubmit", () => {
  const testDatabaseGateway = new End2EndPostgres()
  let app: FastifyInstance
  const auditLogGateway = new AuditLogDynamoGateway(auditLogDynamoConfig)

  beforeAll(async () => {
    app = await build({ auditLogGateway, database: testDatabaseGateway })
    await app.ready()
  })

  beforeEach(async () => {
    mockedCanCaseBeResubmitted.mockImplementation(
      jest.requireActual("../../../services/db/cases/canCaseBeResubmitted").default
    )
    await testDatabaseGateway.clearDb()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  afterAll(async () => {
    await testDatabaseGateway.close()
    await app.close()
  })

  const assertStatusCode = async (encodedJwt: string, code: number) => {
    const { statusCode } = await app.inject(defaultInjectParams(encodedJwt))

    expect(statusCode).toBe(code)
  }

  it("fails if user not in any permitted role", async () => {
    const groups = [
      UserGroup.TriggerHandler,
      UserGroup.Audit,
      UserGroup.UserManager,
      UserGroup.AuditLoggingManager,
      UserGroup.SuperUserManager,
      UserGroup.NewUI
    ]
    const [encodedJwt, user] = generateJwtForStaticUser(groups)
    await createUser(testDatabaseGateway, { groups, jwtId: user.jwtId, username: user.username })
    await createCase(testDatabaseGateway, { errorId: 100 })

    await assertStatusCode(encodedJwt, FORBIDDEN)
  })

  it.each([UserGroup.ExceptionHandler, UserGroup.GeneralHandler, UserGroup.Supervisor, UserGroup.Allocator])(
    "succeeds if user is in role: %s",
    async (role) => {
      const [encodedJwt, user] = generateJwtForStaticUser([role])
      await createUser(testDatabaseGateway, { groups: [role], jwtId: user.jwtId, username: user.username })
      await createCase(testDatabaseGateway, { errorId: 100, errorLockedById: user.username })

      await assertStatusCode(encodedJwt, OK)
    }
  )

  describe("fails if", () => {
    let encodedJwt: string
    let user: User
    const groups = [UserGroup.GeneralHandler]

    beforeEach(() => {
      ;[encodedJwt, user] = generateJwtForStaticUser(groups)
    })

    test("case doesn't belong to same force as user", async () => {
      await createUser(testDatabaseGateway, {
        groups,
        jwtId: user.jwtId,
        username: user.username,
        visibleCourts: [],
        visibleForces: [1]
      })
      await createCase(testDatabaseGateway, { errorId: 100, orgForPoliceFilter: [2] })

      await assertStatusCode(encodedJwt, FORBIDDEN)
    })

    test("case is locked to a different user", async () => {
      await createUser(testDatabaseGateway, { groups, jwtId: user.jwtId, username: user.username })
      await createCase(testDatabaseGateway, { errorId: 100, errorLockedById: "another-user" })

      await assertStatusCode(encodedJwt, FORBIDDEN)
    })

    test("case does not exist", async () => {
      await createUser(testDatabaseGateway, { groups, jwtId: user.jwtId, username: user.username })
      await createCase(testDatabaseGateway, { errorId: 101 })

      await assertStatusCode(encodedJwt, BAD_REQUEST)
    })

    test("case is resolved", async () => {
      await createUser(testDatabaseGateway, { groups, jwtId: user.jwtId, username: user.username })
      await createCase(testDatabaseGateway, {
        errorId: 100,
        errorResolvedAt: new Date(),
        errorResolvedBy: "a-user",
        errorStatus: ResolutionStatusNumber.Resolved,
        resolutionAt: new Date()
      })

      await assertStatusCode(encodedJwt, FORBIDDEN)
    })

    test("case is already submitted", async () => {
      await createUser(testDatabaseGateway, { groups, jwtId: user.jwtId, username: user.username })
      await createCase(testDatabaseGateway, { errorId: 100, errorStatus: ResolutionStatusNumber.Submitted })

      await assertStatusCode(encodedJwt, FORBIDDEN)
    })

    test("DB fails", async () => {
      await createUser(testDatabaseGateway, { groups, jwtId: user.jwtId, username: user.username })
      await createCase(testDatabaseGateway, { errorId: 100 })
      const error = new Error("AggregateError")
      error.name = "AggregateError"
      error.stack = "Something Sql or pOstGreS"
      mockedCanCaseBeResubmitted.mockResolvedValue(error)

      await assertStatusCode(encodedJwt, BAD_GATEWAY)
    })
  })

  it.skip("202 s3 upload successful", () => {})
  it.skip("502 s3 upload failed", () => {})
})
