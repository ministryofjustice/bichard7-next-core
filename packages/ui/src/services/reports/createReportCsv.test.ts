import { createReportCsv } from "./createReportCsv"
import { escapeCsvCell } from "services/reports/utils/escapeCsvCell"
import { isRecord } from "services/reports/utils/isRecord"
import { csvMetadata } from "services/reports/utils/csvMetadata"
import type { ReportConfig } from "types/reports/Config"
import type { ReportType } from "types/reports/ReportType"

jest.mock("services/reports/utils/escapeCsvCell")
jest.mock("services/reports/utils/isRecord")
jest.mock("services/reports/utils/csvMetadata")

const mockedEscapeCsvCell = escapeCsvCell as jest.MockedFunction<typeof escapeCsvCell>
const mockedIsRecord = isRecord as jest.MockedFunction<typeof isRecord>
const mockedCsvMetadata = csvMetadata as jest.MockedFunction<typeof csvMetadata>

describe("createReportCsv", () => {
  const originalBlob = global.Blob

  beforeEach(() => {
    jest.clearAllMocks()

    mockedEscapeCsvCell.mockImplementation((val) => String(val))
    mockedIsRecord.mockReturnValue(true)
    mockedCsvMetadata.mockReturnValue("Mocked Metadata Row")

    global.Blob = jest.fn().mockImplementation((content, options) => ({
      content,
      options
    })) as unknown as typeof Blob
  })

  afterAll(() => {
    global.Blob = originalBlob
  })

  const commonConfigPart = {
    columns: [
      { header: "ID", key: "id" },
      { header: "Name", key: "name" }
    ]
  }

  it("should generate a valid CSV Blob for an ungrouped report", async () => {
    const config: ReportConfig = {
      ...commonConfigPart,
      isGrouped: false
    }
    const data = [
      { id: 1, name: "Alice" },
      { id: 2, name: "Bob" }
    ]

    const result = await createReportCsv(data, config, "TEST_REPORT" as ReportType, "2023-01-01", "2023-12-31")

    expect(mockedCsvMetadata).toHaveBeenCalledWith("TEST_REPORT", "2023-01-01", "2023-12-31")

    const blobContent = (result as any).content[0]

    const lines = blobContent.split("\n")

    expect(lines[0]).toBe("")
    expect(lines[1]).toBe("Mocked Metadata Row")
    expect(lines[2]).toBe("")
    expect(lines[3]).toBe("ID,Name")
    expect(lines[4]).toBe("1,Alice")
    expect(lines[5]).toBe("2,Bob")

    expect((result as any).options).toEqual({ type: "text/csv;charset=utf-8;" })
  })

  it("should generate a valid CSV Blob for a grouped report", async () => {
    const config: ReportConfig = {
      ...commonConfigPart,
      isGrouped: true,
      groupNameKey: "courtName",
      dataListKey: "cases"
    }

    const data = [
      {
        courtName: "Court A",
        cases: [
          { id: 10, name: "Case 1" },
          { id: 11, name: "Case 2" }
        ]
      }
    ]

    const result = await createReportCsv(data, config, "GROUPED_REPORT" as ReportType, null, null)
    const blobContent = (result as any).content[0]
    const lines = blobContent.split("\n")

    expect(lines[3]).toBe('"",Court A')
    expect(lines[4]).toBe("ID,Name")
    expect(lines[5]).toBe("10,Case 1")
    expect(lines[6]).toBe("11,Case 2")
  })

  it("should skip group generation if dataList is not an array", async () => {
    const config: ReportConfig = {
      ...commonConfigPart,
      isGrouped: true,
      groupNameKey: "courtName",
      dataListKey: "cases"
    }

    const data = [
      {
        courtName: "Court A",
        cases: "Not an array"
      }
    ]

    const result = await createReportCsv(data, config, "TEST" as ReportType, null, null)
    const blobContent = (result as any).content[0]
    const lines = blobContent.split("\n")

    expect(lines).toHaveLength(3)
  })

  it("should skip row generation in grouped data if the row is not a record", async () => {
    const config: ReportConfig = {
      ...commonConfigPart,
      isGrouped: true,
      groupNameKey: "courtName",
      dataListKey: "cases"
    }

    const data = [
      {
        courtName: "Court A",
        cases: [{ id: 10, name: "Case 1" }, "Invalid String Row"] // Mixed valid/invalid rows
      }
    ]

    mockedIsRecord.mockImplementation((val) => typeof val === "object" && val !== null)

    const result = await createReportCsv(data, config, "TEST" as ReportType, null, null)
    const blobContent = (result as any).content[0]
    const lines = blobContent.split("\n")

    expect(lines[3]).toBe('"",Court A')
    expect(lines[4]).toBe("ID,Name")
    expect(lines[5]).toBe("10,Case 1")
    expect(lines[6]).toBeUndefined()
  })
})
