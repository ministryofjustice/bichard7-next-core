import type { UserPerformanceDetailDto } from "@moj-bichard7/common/types/reports/UserPerformanceDetail"
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

describe("user performance detail report integration", () => {
  let app: FastifyInstance

  const endpoint = V1.CasesReportsUserPerformanceDetail
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

    const [case0, _case1, case2, _case3] = await createCases(testDatabaseGateway, 4, {
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

    await createTriggers(testDatabaseGateway, case0.errorId, [
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

    await createTriggers(testDatabaseGateway, case2.errorId, [
      {
        status: ResolutionStatusNumber.Unresolved,
        triggerCode: TriggerCode.TRPR0001
      }
    ])

    const query = new URLSearchParams()
    query.append("fromDate", subDays(new Date(), 6).toISOString())
    query.append("toDate", new Date().toISOString())

    const response = await app.inject({ ...defaultRequest(jwt), url: `${endpoint}?${query}` })

    expect(response.statusCode).toBe(200)

    const usersDetailDto = response.json() as UserPerformanceDetailDto[]

    expect(usersDetailDto).toHaveLength(7)

    const todayUserDetail = usersDetailDto.find((userDetail) => isToday(new Date(userDetail.date)))

    if (!todayUserDetail) {
      throw new Error("Today not found")
    }

    expect(todayUserDetail.date).toBe(endOfDay(new Date()).toISOString())

    const trpr0002 = todayUserDetail.triggers.find((t) => t.code === TriggerCode.TRPR0002)
    expect(trpr0002).toBeDefined()
    expect(trpr0002?.totals.resolved).toBe(1)
    expect(trpr0002?.users).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          resolved: 1,
          totalLocked: 0,
          username: user.username
        })
      ])
    )

    const trpr0012 = todayUserDetail.triggers.find((t) => t.code === TriggerCode.TRPR0012)
    expect(trpr0012).toBeDefined()
    expect(trpr0012?.totals.resolved).toBe(1)

    const totalExceptionsResolved = todayUserDetail.exceptions.reduce((sum, exc) => sum + exc.totals.resolved, 0)
    const totalExceptionsLocked = todayUserDetail.exceptions.reduce((sum, exc) => sum + exc.totals.totalLocked, 0)

    const totalTriggersResolved = todayUserDetail.triggers.reduce((sum, trig) => sum + trig.totals.resolved, 0)
    const totalTriggersLocked = todayUserDetail.triggers.reduce((sum, trig) => sum + trig.totals.totalLocked, 0)

    expect(totalExceptionsResolved).toBe(1)
    expect(totalExceptionsLocked).toBe(1)
    expect(totalTriggersResolved).toBe(2)
    expect(totalTriggersLocked).toBe(1)

    const sampleUser = trpr0002?.users.find((u) => u.username === user.username)
    expect(sampleUser?.id).toBeDefined()
    expect(sampleUser?.fullName).toBeDefined()
  })

  it("will receive a 200 and no data", async () => {
    const [jwt] = await createUserAndJwtToken(testDatabaseGateway, [UserGroup.Supervisor])

    const query = new URLSearchParams()
    query.append("fromDate", subDays(new Date(), 6).toISOString())
    query.append("toDate", new Date().toISOString())

    const response = await app.inject({ ...defaultRequest(jwt), url: `${endpoint}?${query}` })

    expect(response.statusCode).toBe(200)

    const usersDetailDto = response.json() as UserPerformanceDetailDto[]

    expect(usersDetailDto).toHaveLength(7)

    let date = new Date()

    for (const userDetail of usersDetailDto) {
      expect(userDetail.date).toBe(endOfDay(date).toISOString())
      expect(userDetail.triggers).toHaveLength(0)
      expect(userDetail.exceptions).toHaveLength(0)

      date = subDays(date, 1)
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
