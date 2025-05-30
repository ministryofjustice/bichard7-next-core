import TriggerCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/TriggerCode"
import { subDays } from "date-fns"
import MockDate from "mockdate"
import "reflect-metadata"
import type User from "services/entities/User"
import getCountOfCasesByCaseAge from "services/getCountOfCasesByCaseAge"
import type { DataSource } from "typeorm"
import { SelectQueryBuilder } from "typeorm"
import CourtCase from "../../src/services/entities/CourtCase"
import getDataSource from "../../src/services/getDataSource"
import { isError } from "../../src/types/Result"
import deleteFromEntity from "../utils/deleteFromEntity"
import { insertCourtCasesWithFields } from "../utils/insertCourtCases"
import { insertTriggers } from "../utils/manageTriggers"

describe("listCourtCases", () => {
  let dataSource: DataSource
  const orgCode = "36FPA1"
  const forceCode = "36"

  beforeAll(async () => {
    dataSource = await getDataSource()
  })

  beforeEach(async () => {
    await deleteFromEntity(CourtCase)
  })

  afterAll(async () => {
    if (dataSource) {
      await dataSource.destroy()
    }
  })

  afterEach(() => {
    MockDate.reset()
  })

  it("Should filter cases that within a specific date", async () => {
    const dateToday = new Date("2001-09-26")
    const dateYesterday = subDays(dateToday, 1)
    const dateDay2 = subDays(dateToday, 2)
    const dateDay3 = subDays(dateToday, 3)
    const dateDay14 = subDays(dateToday, 14)
    const firstDateOlderThanDay14 = subDays(dateToday, 15)
    const secondDateOlderThanDay14 = subDays(dateToday, 36)
    const thirdDateOlderThanDay14 = subDays(dateToday, 400)
    MockDate.set(dateToday)

    await insertCourtCasesWithFields([
      { courtDate: dateToday, orgForPoliceFilter: orgCode },
      { courtDate: dateToday, orgForPoliceFilter: orgCode },
      { courtDate: dateToday, orgForPoliceFilter: orgCode },
      { courtDate: dateToday, orgForPoliceFilter: orgCode },
      { courtDate: dateYesterday, orgForPoliceFilter: orgCode },
      { courtDate: dateYesterday, orgForPoliceFilter: orgCode },
      { courtDate: dateYesterday, orgForPoliceFilter: orgCode },
      { courtDate: dateDay2, orgForPoliceFilter: orgCode },
      { courtDate: dateDay2, orgForPoliceFilter: orgCode },
      { courtDate: dateDay3, orgForPoliceFilter: orgCode },
      { courtDate: dateDay14, orgForPoliceFilter: orgCode },
      { courtDate: firstDateOlderThanDay14, orgForPoliceFilter: orgCode },
      { courtDate: secondDateOlderThanDay14, orgForPoliceFilter: orgCode },
      { courtDate: thirdDateOlderThanDay14, orgForPoliceFilter: orgCode }
    ])

    const result = (await getCountOfCasesByCaseAge(dataSource, {
      visibleCourts: [],
      visibleForces: [forceCode]
    } as Partial<User> as User)) as Record<string, number>

    expect(isError(result)).toBeFalsy()

    expect(result.Today).toBe("4")
    expect(result.Yesterday).toBe("3")
    expect(result["2 days ago"]).toBe("2")
    expect(result["3 days ago"]).toBe("1")
    expect(result["14 days ago"]).toBe("1")
    expect(result["15 days ago and older"]).toBe("3")
  })

  it("Should ignore resolved cases", async () => {
    const dateToday = new Date("2001-09-26")
    MockDate.set(dateToday)

    await insertCourtCasesWithFields([
      { courtDate: dateToday, orgForPoliceFilter: orgCode },
      { courtDate: dateToday, orgForPoliceFilter: orgCode },
      { courtDate: dateToday, orgForPoliceFilter: orgCode, errorStatus: "Resolved", triggerStatus: "Resolved" }
    ])

    const result = (await getCountOfCasesByCaseAge(dataSource, {
      visibleCourts: [],
      visibleForces: [forceCode]
    } as Partial<User> as User)) as Record<string, number>

    expect(isError(result)).toBeFalsy()

    expect(result.Today).toBe("2")
  })

  it("Should ignore cases that are outside of the users organisation", async () => {
    const dateToday = new Date("2001-09-26")
    MockDate.set(dateToday)

    await insertCourtCasesWithFields([
      { courtDate: dateToday, orgForPoliceFilter: orgCode },
      { courtDate: dateToday, orgForPoliceFilter: orgCode },
      { courtDate: dateToday, orgForPoliceFilter: "002" }
    ])

    const result = (await getCountOfCasesByCaseAge(dataSource, {
      visibleCourts: [],
      visibleForces: [forceCode]
    } as Partial<User> as User)) as Record<string, number>

    expect(isError(result)).toBeFalsy()

    expect(result.Today).toBe("2")
  })

  it("will ignore cases with user's excluded triggers", async () => {
    const dateToday = new Date("2001-09-26")
    MockDate.set(dateToday)

    await insertCourtCasesWithFields([
      { courtDate: dateToday, orgForPoliceFilter: orgCode },
      { courtDate: dateToday, orgForPoliceFilter: orgCode },
      { courtDate: dateToday, orgForPoliceFilter: orgCode }
    ])
    await insertTriggers(0, [
      { createdAt: dateToday, triggerCode: TriggerCode.TRPR0001, triggerId: 1, status: "Unresolved" }
    ])
    await insertTriggers(1, [
      { createdAt: dateToday, triggerCode: TriggerCode.TRPR0020, triggerId: 2, status: "Unresolved" }
    ])
    await insertTriggers(2, [
      { createdAt: dateToday, triggerCode: TriggerCode.TRPR0030, triggerId: 3, status: "Unresolved" }
    ])

    const result = (await getCountOfCasesByCaseAge(dataSource, {
      excludedTriggers: [TriggerCode.TRPR0001],
      visibleCourts: [],
      visibleForces: [forceCode]
    } as Partial<User> as User)) as Record<string, number>

    expect(isError(result)).toBeFalsy()

    expect(result.Today).toBe("2")
  })

  describe("When there are no cases", () => {
    it("Should return 0 for each key", async () => {
      const result = (await getCountOfCasesByCaseAge(dataSource, {
        visibleCourts: [],
        visibleForces: [forceCode]
      } as Partial<User> as User)) as Record<string, number>

      expect(isError(result)).toBeFalsy()

      expect(result.Today).toBe("0")
      expect(result.Yesterday).toBe("0")
      expect(result["2 days ago"]).toBe("0")
      expect(result["3 days ago"]).toBe("0")
      expect(result["14 days ago"]).toBe("0")
      expect(result["15 days ago and older"]).toBe("0")
    })
  })

  describe("When there is an error", () => {
    it("Should return the error when failed to unlock court case", async () => {
      jest.spyOn(SelectQueryBuilder.prototype, "getRawOne").mockRejectedValue(Error("Some error"))

      const result = await getCountOfCasesByCaseAge(dataSource, {
        visibleCourts: [],
        visibleForces: [forceCode]
      } as Partial<User> as User)
      expect(isError(result)).toBe(true)

      const receivedError = result as Error

      expect(receivedError.message).toBe("Some error")
    })
  })
})
