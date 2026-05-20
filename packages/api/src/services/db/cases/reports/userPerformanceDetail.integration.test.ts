import type { UserPerformanceDetailReportQuery } from "@moj-bichard7/common/contracts/UserPerformanceDetailReportQuery"
import type { UserPerformanceDetailDto } from "@moj-bichard7/common/types/reports/UserPerformanceDetail"
import type { User } from "@moj-bichard7/common/types/User"

import TriggerCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/TriggerCode"
import { ResolutionStatusNumber } from "@moj-bichard7/common/types/ResolutionStatus"
import { endOfDay, startOfDay, subDays } from "date-fns"

import { createCases } from "../../../../tests/helpers/caseHelper"
import { createTriggers } from "../../../../tests/helpers/triggerHelper"
import { createUsers } from "../../../../tests/helpers/userHelper"
import End2EndPostgres from "../../../../tests/testGateways/e2ePostgres"
import { userPerformanceDetail } from "./userPerformanceDetail"

describe("usersDetailPerformance - Integration", () => {
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

  it("should aggregate detailed performance for RESOLVED items only", async () => {
    const today = new Date()
    const yesterday = subDays(today, 1)
    const filters: UserPerformanceDetailReportQuery = { fromDate: yesterday, toDate: today }

    await createUsers(database, 2, {
      0: { forenames: "John", surname: "Test", username: "john.test" },
      1: { forenames: "Adam", surname: "Test", username: "adam.test" }
    })

    const cases = await createCases(database, 3, {
      0: {
        errorReport: "HO100300",
        errorResolvedAt: startOfDay(today),
        errorResolvedBy: "john.test",
        errorStatus: ResolutionStatusNumber.Resolved,
        orgForPoliceFilter: "01"
      },
      1: {
        errorReport: "HO100300",
        errorResolvedAt: startOfDay(yesterday),
        errorResolvedBy: "john.test",
        errorStatus: ResolutionStatusNumber.Resolved,
        orgForPoliceFilter: "01"
      },
      2: { orgForPoliceFilter: "01" } // Case for Adam's trigger
    })

    await createTriggers(database, cases[2].errorId, [
      {
        resolvedAt: startOfDay(today),
        resolvedBy: "adam.test",
        status: ResolutionStatusNumber.Resolved,
        triggerCode: TriggerCode.TRPR0002
      }
    ])

    const results: UserPerformanceDetailDto[] = []
    await database.writable.transaction(async (trx) => {
      for await (const result of userPerformanceDetail(trx, mockUser, filters)) {
        results.push(result[0])
      }
    })

    expect(results).toHaveLength(2)

    const todayResult = results.find((r) => r.date.toISOString() === endOfDay(today).toISOString())!

    expect(todayResult.codeDetails).toHaveLength(2)

    const exceptionGroupToday = todayResult.codeDetails.find((c) => c.code === "HO100300")
    expect(exceptionGroupToday).toBeDefined()
    expect(exceptionGroupToday?.description).toBe("Organisation not recognised")

    const johnExceptionToday = exceptionGroupToday?.users.find((u) => u.username === "john.test")
    expect(johnExceptionToday?.resolved).toBe(1)
    expect(johnExceptionToday?.totalLocked).toBe(0)

    const triggerGroupToday = todayResult.codeDetails.find((c) => c.code === "TRPR0002")
    expect(triggerGroupToday).toBeDefined()
    expect(triggerGroupToday?.description).toBe("Warrant issued")

    const adamTriggerToday = triggerGroupToday?.users.find((u) => u.username === "adam.test")
    expect(adamTriggerToday?.resolved).toBe(1)
    expect(adamTriggerToday?.totalLocked).toBe(0)

    const yesterdayResult = results.find((r) => r.date.toISOString() === endOfDay(yesterday).toISOString())!

    const exceptionGroupYesterday = yesterdayResult.codeDetails.find((c) => c.code === "HO100300")
    expect(exceptionGroupYesterday?.description).toBe("Organisation not recognised")

    const johnExceptionYesterday = exceptionGroupYesterday?.users.find((u) => u.username === "john.test")
    expect(johnExceptionYesterday?.resolved).toBe(1)
    expect(johnExceptionYesterday?.totalLocked).toBe(0)
  })

  it("should aggregate detailed performance for LOCKED items only, pegging them to the 'toDate'", async () => {
    const today = new Date()
    const yesterday = subDays(today, 1)
    const filters: UserPerformanceDetailReportQuery = { fromDate: yesterday, toDate: today }

    await createUsers(database, 2, {
      0: { forenames: "John", surname: "Test", username: "john.test" },
      1: { forenames: "Adam", surname: "Test", username: "adam.test" }
    })

    const cases = await createCases(database, 2, {
      0: {
        errorLockedById: "john.test",
        errorReport: "HO100322",
        errorStatus: ResolutionStatusNumber.Unresolved,
        orgForPoliceFilter: "01"
      },
      1: {
        orgForPoliceFilter: "01",
        triggerLockedById: "adam.test",
        triggerStatus: ResolutionStatusNumber.Unresolved
      }
    })

    await createTriggers(database, cases[1].errorId, [
      {
        status: ResolutionStatusNumber.Unresolved,
        triggerCode: TriggerCode.TRPR0004
      }
    ])

    const results: UserPerformanceDetailDto[] = []
    await database.writable.transaction(async (trx) => {
      for await (const result of userPerformanceDetail(trx, mockUser, filters)) {
        results.push(result[0])
      }
    })

    const todayResult = results.find((r) => r.date.toISOString() === endOfDay(today).toISOString())!

    const exceptionCodeGroup = todayResult.codeDetails.find((c) => c.code === "HO100322")
    expect(exceptionCodeGroup?.description).toBe("Next Result Source Organisation is absent for a remand")
    expect(exceptionCodeGroup?.totals.resolved).toBe(0)
    expect(exceptionCodeGroup?.totals.totalLocked).toBe(1)

    const johnLock = exceptionCodeGroup?.users.find((u) => u.username === "john.test")
    expect(johnLock?.resolved).toBe(0)
    expect(johnLock?.totalLocked).toBe(1)

    const triggerCodeGroup = todayResult.codeDetails.find((c) => c.code === "TRPR0004")
    expect(triggerCodeGroup?.description).toBe("Sex offender")
    expect(triggerCodeGroup?.totals.resolved).toBe(0)
    expect(triggerCodeGroup?.totals.totalLocked).toBe(1)

    const adamLock = triggerCodeGroup?.users.find((u) => u.username === "adam.test")
    expect(adamLock?.resolved).toBe(0)
    expect(adamLock?.totalLocked).toBe(1)
  })

  it("should accurately sum BOTH resolved and locked items within the same code group", async () => {
    const today = new Date()
    const yesterday = subDays(today, 1)
    const filters: UserPerformanceDetailReportQuery = { fromDate: yesterday, toDate: today }

    await createUsers(database, 1, {
      0: { forenames: "John", surname: "Test", username: "john.test" }
    })

    await createCases(database, 2, {
      0: {
        errorReport: "HO100300",
        errorResolvedAt: startOfDay(today),
        errorResolvedBy: "john.test",
        errorStatus: ResolutionStatusNumber.Resolved,
        orgForPoliceFilter: "01"
      },
      1: {
        errorLockedById: "john.test",
        errorReport: "HO100300",
        errorStatus: ResolutionStatusNumber.Unresolved,
        orgForPoliceFilter: "01"
      }
    })

    const results: UserPerformanceDetailDto[] = []
    await database.writable.transaction(async (trx) => {
      for await (const result of userPerformanceDetail(trx, mockUser, filters)) {
        results.push(result[0])
      }
    })

    const todayResult = results.find((r) => r.date.toISOString() === endOfDay(today).toISOString())!

    expect(todayResult.codeDetails).toHaveLength(1)

    const codeGroup = todayResult.codeDetails[0]
    expect(codeGroup.code).toBe("HO100300")
    expect(codeGroup.description).toBe("Organisation not recognised")
    expect(codeGroup.totals.resolved).toBe(1)
    expect(codeGroup.totals.totalLocked).toBe(1)

    const johnStats = codeGroup.users.find((u) => u.username === "john.test")
    expect(johnStats?.resolved).toBe(1)
    expect(johnStats?.totalLocked).toBe(1)
  })
})
