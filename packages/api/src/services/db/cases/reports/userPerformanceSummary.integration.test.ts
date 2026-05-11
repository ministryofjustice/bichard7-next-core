import type { UserSummaryReportQuery } from "@moj-bichard7/common/contracts/UserSummaryReportQuery"
import type { UserPerformanceSummaryDto } from "@moj-bichard7/common/types/reports/UserPerformanceSummary"
import type { User } from "@moj-bichard7/common/types/User"

import { ResolutionStatusNumber } from "@moj-bichard7/common/types/ResolutionStatus"
import { endOfDay, startOfDay, subDays } from "date-fns"

import { createCases } from "../../../../tests/helpers/caseHelper"
import { createTriggers } from "../../../../tests/helpers/triggerHelper"
import { createUsers } from "../../../../tests/helpers/userHelper"
import End2EndPostgres from "../../../../tests/testGateways/e2ePostgres"
import { userPerformanceSummary } from "./userPerformanceSummary"

describe("usersSummaryPerformance - Integration", () => {
  let database: End2EndPostgres

  const mockUser = {
    excludedTriggers: [],
    username: "test_admin",
    visibleCourts: [],
    visibleForces: ["01"]
  } as unknown as User

  beforeAll(async () => {
    database = new End2EndPostgres()
  })

  beforeEach(async () => {
    await database.clearDb()
  })

  afterAll(async () => {
    await database.close()
  })

  it("should aggregate exceptions, triggers, and locks for users based on actual database records and user visibility", async () => {
    const today = new Date()
    const yesterday = subDays(today, 1)

    const filters: UserSummaryReportQuery = {
      fromDate: yesterday,
      toDate: today
    }

    await createUsers(database, 2, {
      0: { forenames: "John", surname: "Test", username: "john.test" },
      1: { forenames: "Adam", surname: "Test", username: "adam.test" }
    })
    await createCases(database, 5, {
      0: {
        errorResolvedAt: startOfDay(today),
        errorResolvedBy: "john.test",
        errorStatus: ResolutionStatusNumber.Resolved,
        triggerResolvedAt: null,
        triggerResolvedBy: null,
        triggerStatus: ResolutionStatusNumber.Unresolved
      },
      1: {
        errorResolvedAt: startOfDay(yesterday),
        errorResolvedBy: "john.test",
        errorStatus: ResolutionStatusNumber.Resolved,
        triggerResolvedAt: null,
        triggerResolvedBy: null,
        triggerStatus: ResolutionStatusNumber.Unresolved
      },
      2: {
        errorLockedById: "adam.test"
      },
      3: { triggerResolvedAt: startOfDay(today), triggerResolvedBy: "adam.test" },
      4: {
        errorResolvedAt: startOfDay(today),
        errorResolvedBy: "john.test",
        errorStatus: ResolutionStatusNumber.Resolved,
        orgForPoliceFilter: "04"
      }
    })
    await createTriggers(database, 3, [
      {
        resolvedAt: startOfDay(today),
        resolvedBy: "adam.test",
        status: ResolutionStatusNumber.Resolved
      }
    ])

    const results: UserPerformanceSummaryDto = []

    await database.writable.transaction(async (trx) => {
      const generator = userPerformanceSummary(trx, mockUser, filters)

      for await (const result of generator) {
        results.push(result[0])
      }
    })

    expect(results).toHaveLength(2)

    const todayResult = results[0]
    expect(todayResult.date.toISOString()).toBe(endOfDay(today).toISOString())

    const johnToday = todayResult.users.find((u) => u.username === "john.test")
    expect(johnToday).toBeDefined()
    expect(johnToday?.exceptionsResolved).toBe(1)
    expect(johnToday?.triggerResolved).toBe(0)
    expect(johnToday?.totalNumberStillLocked).toBe(0)

    const adamToday = todayResult.users.find((u) => u.username === "adam.test")
    expect(adamToday).toBeDefined()
    expect(adamToday?.exceptionsResolved).toBe(0)
    expect(adamToday?.triggerResolved).toBe(1)
    expect(adamToday?.totalNumberStillLocked).toBe(1)

    const yesterdayResult = results[1]
    expect(yesterdayResult.date.toISOString()).toBe(endOfDay(yesterday).toISOString())

    const johnYesterday = yesterdayResult.users.find((u) => u.username === "john.test")
    expect(johnYesterday).toBeDefined()
    expect(johnYesterday?.exceptionsResolved).toBe(1)
  })
})
