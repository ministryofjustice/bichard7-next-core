import type { UserDetailJsonRow } from "../../../../types/reports/UserDetail"

import { mapToUserPerformanceDetailDtoDay } from "../../../dto/reports/mapToUserPerformanceDetailDtoDay"
import { processUserPerformanceDetail } from "./processUserPerformanceDetail"

jest.mock("../../../dto/reports/mapToUserPerformanceDetailDtoDay")

async function consumeGenerator<T>(generator: AsyncGenerator<T>): Promise<T[]> {
  const results: T[] = []
  for await (const value of generator) {
    results.push(value)
  }

  return results
}

async function* createCursor(batches: UserDetailJsonRow[][]): AsyncIterable<UserDetailJsonRow[]> {
  for (const batch of batches) {
    yield batch
  }
}

describe("processUserPerformanceDetail", () => {
  beforeEach(() => {
    ;(mapToUserPerformanceDetailDtoDay as jest.Mock).mockImplementation((date: Date, row?: UserDetailJsonRow) => ({
      hasRow: !!row,
      mappedDate: date.toISOString()
    }))
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it("should yield empty records for the entire date range if the cursor is completely empty", async () => {
    const fromDate = new Date("2026-05-01T00:00:00Z")
    const toDate = new Date("2026-05-03T23:59:59Z")

    const generator = processUserPerformanceDetail(createCursor([]), fromDate, toDate)

    const [may3, may2, may1] = (await consumeGenerator(generator)).flat()

    expect(may3).toMatchObject({ hasRow: false })
    expect(may2).toMatchObject({ hasRow: false })
    expect(may1).toMatchObject({ hasRow: false })
  })

  it("should yield mapped rows when contiguous data is provided by the cursor", async () => {
    const fromDate = new Date("2026-05-01T00:00:00Z")
    const toDate = new Date("2026-05-02T23:59:59Z")

    const mockRows = [
      { report_date: new Date("2026-05-02T12:00:00Z") } as unknown as UserDetailJsonRow,
      { report_date: new Date("2026-05-01T12:00:00Z") } as unknown as UserDetailJsonRow
    ]

    const generator = processUserPerformanceDetail(createCursor([mockRows]), fromDate, toDate)
    const [may2, may1] = (await consumeGenerator(generator)).flat()

    expect(may2).toMatchObject({ hasRow: true })
    expect(may1).toMatchObject({ hasRow: true })
  })

  it("should fill gaps with empty records if rows are missing in the middle of the date range", async () => {
    const fromDate = new Date("2026-05-01T00:00:00Z")
    const toDate = new Date("2026-05-05T23:59:59Z")

    const mockRows = [
      { report_date: new Date("2026-05-05T12:00:00Z") } as unknown as UserDetailJsonRow,
      { report_date: new Date("2026-05-02T12:00:00Z") } as unknown as UserDetailJsonRow
    ]

    const generator = processUserPerformanceDetail(createCursor([mockRows]), fromDate, toDate)

    const [may5, may4, may3, may2, may1] = (await consumeGenerator(generator)).flat()

    expect(may5).toMatchObject({ hasRow: true })
    expect(may4).toMatchObject({ hasRow: false })
    expect(may3).toMatchObject({ hasRow: false })
    expect(may2).toMatchObject({ hasRow: true })
    expect(may1).toMatchObject({ hasRow: false })
  })

  it("should process data across multiple cursor batches smoothly", async () => {
    const fromDate = new Date("2026-05-01T00:00:00Z")
    const toDate = new Date("2026-05-03T23:59:59Z")

    const batch1 = [{ report_date: new Date("2026-05-03T12:00:00Z") } as unknown as UserDetailJsonRow]
    const batch2 = [{ report_date: new Date("2026-05-01T12:00:00Z") } as unknown as UserDetailJsonRow]

    const generator = processUserPerformanceDetail(createCursor([batch1, batch2]), fromDate, toDate)

    const [may3, may2, may1] = (await consumeGenerator(generator)).flat()

    expect(may3).toMatchObject({ hasRow: true })
    expect(may2).toMatchObject({ hasRow: false })
    expect(may1).toMatchObject({ hasRow: true })
  })
})
