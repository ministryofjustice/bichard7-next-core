import type { ExceptionReportQuery } from "@moj-bichard7/common/contracts/ExceptionReport"
import type { ExceptionReportDto } from "@moj-bichard7/common/types/reports/Exceptions"
import type { User } from "@moj-bichard7/common/types/User"

import TriggerCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/TriggerCode" // Update this path
import { ResolutionStatusNumber } from "@moj-bichard7/common/types/ResolutionStatus"
import { parse, startOfDay, subDays } from "date-fns"

import { createCases } from "../../../../tests/helpers/caseHelper"
import { createTriggers } from "../../../../tests/helpers/triggerHelper"
import { createUsers } from "../../../../tests/helpers/userHelper"
import End2EndPostgres from "../../../../tests/testGateways/e2ePostgres"
import { exceptionsReport } from "./exceptions"

describe("usersDetailPerformance - Integration", () => {
  let database: End2EndPostgres

  beforeAll(async () => {
    database = new End2EndPostgres()
  })

  beforeEach(async () => {
    await database.clearDb()
  })

  afterAll(async () => {
    await database.close()
  })

  it("should fetch, join full names, group, and order by full name alphabetically", async () => {
    const today = new Date()
    const yesterday = subDays(today, 1)

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
      2: {
        orgForPoliceFilter: "01"
      }
    })

    await createTriggers(database, cases[2].errorId, [
      {
        resolvedAt: startOfDay(today),
        resolvedBy: "adam.test",
        status: ResolutionStatusNumber.Resolved,
        triggerCode: TriggerCode.TRPR0002
      }
    ])

    const mockUser = { visibleCourts: [], visibleForces: ["01"] } as unknown as User

    const filters: ExceptionReportQuery = {
      exceptions: true,
      fromDate: yesterday,
      resolvedBy: [],
      toDate: today,
      triggers: true
    }

    const results: ExceptionReportDto[] = []
    await database.writable.transaction(async (trx) => {
      for await (const batch of exceptionsReport(trx, mockUser, filters)) {
        results.push(...batch)
      }
    })

    expect(results).toHaveLength(2)

    const [adamResult, johnResult] = results

    expect(adamResult.username).toBe("Adam Test")
    expect(adamResult.cases).toHaveLength(1)
    expect(adamResult.cases[0].type).toBe("Tr")

    expect(johnResult.username).toBe("John Test")
    expect(johnResult.cases).toHaveLength(2)
    expect(johnResult.cases[0].type).toBe("Ex")
    expect(johnResult.cases[1].type).toBe("Ex")

    const johnFirstCaseResolvedTs = parse(johnResult.cases[0].resolvedAt, "dd/MM/yyyy HH:mm", new Date()).getTime()
    const johnSecondCaseResolvedTs = parse(johnResult.cases[1].resolvedAt, "dd/MM/yyyy HH:mm", new Date()).getTime()

    expect(johnFirstCaseResolvedTs).toBeLessThanOrEqual(johnSecondCaseResolvedTs)
  })

  it("should successfully filter by the resolvedBy array", async () => {
    const today = new Date()

    const cases = await createCases(database, 2, {
      0: {
        errorReport: "HO100300",
        errorResolvedAt: startOfDay(today),
        errorResolvedBy: "john.test",
        errorStatus: ResolutionStatusNumber.Resolved,
        orgForPoliceFilter: "01"
      },
      1: { orgForPoliceFilter: "01" }
    })

    await createTriggers(database, cases[1].errorId, [
      {
        resolvedAt: startOfDay(today),
        resolvedBy: "adam.test",
        status: ResolutionStatusNumber.Resolved,
        triggerCode: TriggerCode.TRPR0002
      }
    ])

    const mockUser = { visibleCourts: [], visibleForces: ["01"] } as unknown as User
    const filters: ExceptionReportQuery = {
      exceptions: true,
      fromDate: today,
      resolvedBy: ["adam.test"],
      toDate: today,
      triggers: true
    }

    const results: ExceptionReportDto[] = []
    await database.writable.transaction(async (trx) => {
      for await (const batch of exceptionsReport(trx, mockUser, filters)) {
        results.push(...batch)
      }
    })

    expect(results).toHaveLength(1)
    expect(results[0].username).toBe("adam.test")
  })
})
