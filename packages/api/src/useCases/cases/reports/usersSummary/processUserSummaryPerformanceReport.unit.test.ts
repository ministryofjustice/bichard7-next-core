import type { UserSummaryPerformanceDto } from "@moj-bichard7/common/types/reports/UsersSummaryPerformance"

import { endOfDay, subDays } from "date-fns"

import type { UserSummaryRow } from "../../../../types/reports/UserSummary"

import { caseToUserSummaryDto } from "../../../dto/reports/caseToUserSummaryDto"
import { processUsersSummaryReport } from "./processUserSummaryReport"

jest.mock("../../../dto/reports/caseToUserSummaryDto")

const mockedCaseToUserSummaryDto = caseToUserSummaryDto as jest.MockedFunction<typeof caseToUserSummaryDto>

async function* createAsyncIterable<T>(items: T[][]): AsyncIterable<T[]> {
  for (const item of items) {
    yield item
  }
}

describe("processUsersSummaryReport", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("should yield empty reports for all dates when the cursor yields no data", async () => {
    const fromDate = new Date("2023-10-01T12:00:00Z")
    const toDate = new Date("2023-10-03T12:00:00Z")
    const cursor = createAsyncIterable<UserSummaryRow>([])

    const generator = processUsersSummaryReport(cursor, fromDate, toDate)
    const results = []

    for await (const result of generator) {
      results.push(result[0])
    }

    expect(results).toHaveLength(3)

    expect(results[0]).toStrictEqual({
      date: endOfDay(toDate),
      totals: { exceptionsResolved: 0, totalNumberStillLocked: 0, triggerResolved: 0 },
      users: []
    })

    expect(results[1]).toStrictEqual({
      date: subDays(endOfDay(toDate), 1),
      totals: { exceptionsResolved: 0, totalNumberStillLocked: 0, triggerResolved: 0 },
      users: []
    })

    expect(results[2]).toStrictEqual({
      date: subDays(endOfDay(toDate), 2),
      totals: { exceptionsResolved: 0, totalNumberStillLocked: 0, triggerResolved: 0 },
      users: []
    })
  })

  it("should process rows, map to DTOs, and aggregate totals accurately for a single day", async () => {
    const fromDate = new Date("2023-10-03T12:00:00Z")
    const toDate = new Date("2023-10-03T12:00:00Z")

    const mockRow = {
      report_date: new Date("2023-10-03T10:00:00Z")
    } as unknown as UserSummaryRow

    const cursor = createAsyncIterable<UserSummaryRow>([[mockRow, mockRow]])

    const mockDto = {
      exceptionsResolved: 2,
      totalNumberStillLocked: 1,
      triggerResolved: 3
    } as unknown as UserSummaryPerformanceDto

    mockedCaseToUserSummaryDto.mockReturnValue(mockDto)

    const generator = processUsersSummaryReport(cursor, fromDate, toDate)
    const results = []

    for await (const result of generator) {
      results.push(result[0])
    }

    expect(results).toHaveLength(1)
    expect(results[0]).toStrictEqual({
      date: endOfDay(toDate),
      totals: {
        exceptionsResolved: 4,
        totalNumberStillLocked: 2,
        triggerResolved: 6
      },
      users: [mockDto, mockDto]
    })

    expect(mockedCaseToUserSummaryDto).toHaveBeenCalledTimes(2)
    expect(mockedCaseToUserSummaryDto).toHaveBeenCalledWith(mockRow)
  })

  it("should correctly handle and fill in missing dates between data rows", async () => {
    const fromDate = new Date("2023-10-01T12:00:00Z")
    const toDate = new Date("2023-10-03T12:00:00Z")

    const rowOct3 = { report_date: new Date("2023-10-03T10:00:00Z") } as unknown as UserSummaryRow
    const rowOct1 = { report_date: new Date("2023-10-01T10:00:00Z") } as unknown as UserSummaryRow

    const cursor = createAsyncIterable<UserSummaryRow>([[rowOct3], [rowOct1]])

    const mockDtoOct3 = {
      exceptionsResolved: 1,
      totalNumberStillLocked: 0,
      triggerResolved: 0
    } as unknown as UserSummaryPerformanceDto
    const mockDtoOct1 = {
      exceptionsResolved: 0,
      totalNumberStillLocked: 0,
      triggerResolved: 1
    } as unknown as UserSummaryPerformanceDto

    mockedCaseToUserSummaryDto.mockReturnValueOnce(mockDtoOct3).mockReturnValueOnce(mockDtoOct1)

    const generator = processUsersSummaryReport(cursor, fromDate, toDate)
    const results = []

    for await (const result of generator) {
      results.push(result[0])
    }

    expect(results).toHaveLength(3)

    // Day 1: 3rd Oct (Has Data)
    expect(results[0].users).toHaveLength(1)
    expect(results[0].totals.exceptionsResolved).toBe(1)

    // Day 2: 2nd Oct (Missing Data - Filled with Empty)
    expect(results[1].users).toHaveLength(0)
    expect(results[1].totals.exceptionsResolved).toBe(0)

    // Day 3: 1st Oct (Has Data)
    expect(results[2].users).toHaveLength(1)
    expect(results[2].totals.triggerResolved).toBe(1)
  })
})
