import type { UserPerformanceSummaryDto } from "@moj-bichard7/common/types/reports/UserPerformanceSummary"
import type { FastifyInstance } from "fastify"

import TriggerCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/TriggerCode"
import { V1 } from "@moj-bichard7/common/apiEndpoints/versionedEndpoints"
import { ResolutionStatusNumber } from "@moj-bichard7/common/types/ResolutionStatus"
import { UserGroup } from "@moj-bichard7/common/types/UserGroup"
import { addDays, endOfDay, isToday, subDays } from "date-fns"
import { BAD_REQUEST, FORBIDDEN } from "http-status"

import build from "../../../../app"
import { AuditLogDynamoGateway } from "../../../../services/gateways/dynamo"
import { createCases } from "../../../../tests/helpers/caseHelper"
import auditLogDynamoConfig from "../../../../tests/helpers/dynamoDbConfig"
import { createTriggers } from "../../../../tests/helpers/triggerHelper"
import { createUserAndJwtToken } from "../../../../tests/helpers/userHelper"
import End2EndPostgres from "../../../../tests/testGateways/e2ePostgres"
import TestDynamoGateway from "../../../../tests/testGateways/TestDynamoGateway/TestDynamoGateway"

const defaultRequest = (jwt: string) => {
  return {
    headers: {
      Authorization: `Bearer ${jwt}`,
      Connection: "close"
    }
  }
}

describe("user performance summary report integration", () => {
  let app: FastifyInstance

  const endpoint = V1.CasesReportsUserPerformanceSummary
  const testDatabaseGateway = new End2EndPostgres()
  const testDynamoGateway = new TestDynamoGateway(auditLogDynamoConfig)
  const auditLogGateway = new AuditLogDynamoGateway(auditLogDynamoConfig)

  beforeAll(async () => {
    app = await build({ auditLogGateway, database: testDatabaseGateway })
    await app.ready()
  })

  beforeEach(async () => {
    await testDatabaseGateway.clearDb()
    await testDynamoGateway.clearDynamo()
  })

  afterAll(async () => {
    await app.close()
    await testDatabaseGateway.close()
  })

  it("will receive a 200 and data", async () => {
    const [jwt, user] = await createUserAndJwtToken(testDatabaseGateway, [UserGroup.Supervisor])

    const [caseObj] = await createCases(testDatabaseGateway, 4, {
      0: { triggerResolvedBy: user.username, triggerStatus: ResolutionStatusNumber.Resolved },
      1: {
        errorLockedById: user.username,
        errorStatus: ResolutionStatusNumber.Unresolved
      },
      2: {
        triggerLockedById: user.username,
        triggerStatus: ResolutionStatusNumber.Unresolved
      },
      3: { errorResolvedAt: new Date(), errorResolvedBy: user.username, errorStatus: ResolutionStatusNumber.Resolved }
    })

    await createTriggers(testDatabaseGateway, caseObj.errorId, [
      {
        resolvedAt: new Date(),
        resolvedBy: user.username,
        status: ResolutionStatusNumber.Resolved,
        triggerCode: TriggerCode.TRPR0002
      },
      {
        resolvedAt: new Date(),
        resolvedBy: user.username,
        status: ResolutionStatusNumber.Resolved,
        triggerCode: TriggerCode.TRPR0012
      }
    ])

    const query = new URLSearchParams()
    query.append("fromDate", subDays(new Date(), 6).toISOString())
    query.append("toDate", new Date().toISOString())

    const response = await app.inject({ ...defaultRequest(jwt), url: `${endpoint}?${query}` })

    expect(response.statusCode).toBe(200)

    const usersSummaryDto = response.json() as UserPerformanceSummaryDto

    expect(usersSummaryDto).toHaveLength(7)

    const todayUserSummary = usersSummaryDto.find((userSummary) => isToday(userSummary.date))

    if (!todayUserSummary) {
      throw new Error("Today not found")
    }

    expect(todayUserSummary.date).toBe(endOfDay(new Date()).toISOString())
    expect(todayUserSummary.totals.totalNumberStillLocked).toBe(2)
    expect(todayUserSummary.totals.triggerResolved).toBe(2)
    expect(todayUserSummary.totals.exceptionsResolved).toBe(1)
    expect(todayUserSummary.users).toHaveLength(1)

    expect(todayUserSummary.users[0].exceptionsResolved).toBe(1)
    expect(todayUserSummary.users[0].fullName).toBe("Forename1 Surname1")
    expect(todayUserSummary.users[0].id).toBe(1)
    expect(todayUserSummary.users[0].totalNumberStillLocked).toBe(2)
    expect(todayUserSummary.users[0].triggerResolved).toBe(2)
    expect(todayUserSummary.users[0].username).toBe("User1")
  })

  it("will receive a 200 and no data", async () => {
    const [jwt] = await createUserAndJwtToken(testDatabaseGateway, [UserGroup.Supervisor])

    const query = new URLSearchParams()
    query.append("fromDate", subDays(new Date(), 6).toISOString())
    query.append("toDate", new Date().toISOString())

    const response = await app.inject({ ...defaultRequest(jwt), url: `${endpoint}?${query}` })

    expect(response.statusCode).toBe(200)

    const usersSummaryDto = response.json() as UserPerformanceSummaryDto

    expect(usersSummaryDto).toHaveLength(7)

    for (const userSummary of usersSummaryDto) {
      expect(userSummary.users).toHaveLength(0)
      expect(userSummary.totals.triggerResolved).toBe(0)
      expect(userSummary.totals.exceptionsResolved).toBe(0)
      expect(userSummary.totals.totalNumberStillLocked).toBe(0)
    }
  })

  it("fails if the fromDate is before the toDate", async () => {
    const [jwt] = await createUserAndJwtToken(testDatabaseGateway, [UserGroup.Supervisor])

    const query = new URLSearchParams()
    query.append("fromDate", addDays(new Date(), 1).toISOString())
    query.append("toDate", new Date().toISOString())

    const { statusCode } = await app.inject({ ...defaultRequest(jwt), url: `${endpoint}?${query}` })

    expect(statusCode).toBe(BAD_REQUEST)
  })

  it("fails if the user isn't in the correct group", async () => {
    const [jwt] = await createUserAndJwtToken(testDatabaseGateway, [UserGroup.GeneralHandler])

    const query = new URLSearchParams()
    query.append("fromDate", subDays(new Date(), 7).toISOString())
    query.append("toDate", new Date().toISOString())

    const { statusCode } = await app.inject({ ...defaultRequest(jwt), url: `${endpoint}?${query}` })

    expect(statusCode).toBe(FORBIDDEN)
  })
})
